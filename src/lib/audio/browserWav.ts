/**
 * Conversión de grabaciones del navegador a WAV PCM16 mono.
 * El WAV se analiza con wav-decoder en el servidor sin necesitar FFmpeg
 * para decodificar el formato WebM/MP4 original del MediaRecorder.
 */

/** Codifica muestras PCM Float32 mono como WAV PCM de 16 bits. */
export function encodePcm16Wav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  if (!Number.isInteger(sampleRate) || sampleRate <= 0) {
    throw new Error('La frecuencia de muestreo del audio no es válida.');
  }
  if (samples.length === 0) {
    throw new Error('La grabación no contiene muestras de audio.');
  }

  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const output = new ArrayBuffer(44 + dataSize);
  const view = new DataView(output);

  const writeAscii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true); // byte rate
  view.setUint16(32, bytesPerSample, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeAscii(36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < samples.length; i++) {
    const rawSample = Number.isFinite(samples[i]) ? samples[i] : 0;
    const sample = Math.max(-1, Math.min(1, rawSample));
    // PCM signed int16 utiliza -32768 para -1 y 32767 para +1.
    const pcm = sample < 0 ? Math.round(sample * 32768) : Math.round(sample * 32767);
    view.setInt16(44 + i * bytesPerSample, pcm, true);
  }

  return output;
}

/**
 * Decodifica el contenedor compatible con el navegador y crea WAV PCM16 mono.
 * Conserva la frecuencia de muestreo original; las métricas del backend reciben
 * la frecuencia real indicada en la cabecera WAV.
 */
export async function convertBlobToWav(blob: Blob): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('La conversión de audio debe ejecutarse en el navegador.');
  }

  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    throw new Error('Este navegador no permite preparar audio WAV. Prueba una versión reciente de Chrome, Edge o Safari.');
  }

  const audioContext = new AudioContextConstructor();

  try {
    const encodedAudio = await blob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(encodedAudio.slice(0));

    if (decoded.length === 0 || decoded.numberOfChannels === 0) {
      throw new Error('El navegador no detectó muestras de audio en la grabación.');
    }

    // El análisis actual trabaja en mono. Promediamos canales en vez de descartar
    // uno arbitrariamente, evitando duplicar el tamaño de la carga útil.
    const mono = new Float32Array(decoded.length);
    for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
      const channelSamples = decoded.getChannelData(channel);
      for (let i = 0; i < channelSamples.length; i++) {
        mono[i] += channelSamples[i] / decoded.numberOfChannels;
      }
    }

    const wavBuffer = encodePcm16Wav(mono, decoded.sampleRate);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } catch (error) {
    console.error('[AUDIO] No se pudo convertir la grabación del navegador a WAV:', error);
    throw new Error('No se pudo preparar el audio para el análisis. Actualiza el navegador y vuelve a grabar en un lugar tranquilo.');
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close().catch(() => undefined);
    }
  }
}
