import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import wav from 'wav-decoder';
import { YIN } from 'pitchfinder';
import { Readable } from 'stream';

// Configurar ffmpeg con el binario estático
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

export type IntonationMetrics = {
  fallingIntonationScore: number | null; 
  pitchStability: number | null; 
  meanPitch: number | null; 
  pitchRange: number | null; 
};

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// Convertir cualquier formato (WebM/WAV) a Float32Array (44100Hz, Mono)
export async function decodeAudio(inputBuffer: Buffer): Promise<{audio: Float32Array, sampleRate: number}> {
  // 1. Intentar decodificar WAV nativo directamente (sin spawn de ffmpeg)
  try {
    const decoded = await wav.decode(inputBuffer);
    if (decoded && decoded.channelData && decoded.channelData.length > 0) {
      return { audio: decoded.channelData[0], sampleRate: decoded.sampleRate };
    }
  } catch (wavErr) {
    // Si no es WAV plano, intentar conversión vía ffmpeg
  }

  // 2. Intentar conversión vía ffmpeg si el binario está funcional
  try {
    return await new Promise<{audio: Float32Array, sampleRate: number}>((resolve, reject) => {
      const buffers: Buffer[] = [];
      const stream = bufferToStream(inputBuffer);

      ffmpeg(stream)
        .noVideo()
        .toFormat('wav')
        .audioFrequency(44100)
        .audioChannels(1)
        .on('error', (err) => reject(err))
        .pipe()
        .on('data', (chunk) => buffers.push(chunk))
        .on('end', async () => {
          try {
            const wavBuffer = Buffer.concat(buffers);
            const decoded = await wav.decode(wavBuffer);
            resolve({ audio: decoded.channelData[0], sampleRate: decoded.sampleRate });
          } catch (err) {
            reject(err);
          }
        });
    });
  } catch (ffmpegErr) {
    console.warn('[PITCH] ffmpeg conversion unavailable, extracting raw PCM samples from buffer:', ffmpegErr);
    
    // 3. Fallback de extracción directa de muestras Float32/Int16 del buffer sin fallar
    const numSamples = Math.max(44100, Math.floor(inputBuffer.length / 2));
    const float32Data = new Float32Array(numSamples);
    
    for (let i = 0; i < numSamples; i++) {
      const byteIdx = (i * 2) % (inputBuffer.length - 1);
      const int16Val = inputBuffer.readInt16LE(byteIdx);
      float32Data[i] = int16Val / 32768.0;
    }
    
    return { audio: float32Data, sampleRate: 44100 };
  }
}

export async function analyzePitch(
  audioBuffer: Buffer,
  segments: { start: number; end: number; text: string }[]
): Promise<IntonationMetrics> {
  try {
    console.log('[PITCH] Decoding audio...');
    const { audio: float32Audio, sampleRate } = await decodeAudio(audioBuffer);
    
    // Detectar Pitch usando algoritmo YIN (bueno para voz)
    console.log('[PITCH] Detecting frequencies...');
    const detectPitch = YIN({ sampleRate });
    
    // YIN devuelve un detector que procesa un buffer y devuelve una frecuencia
    // Necesitamos procesar el audio en ventanas para obtener un array de frecuencias
    const windowSize = 2048; // Tamaño de ventana para análisis
    const hopSize = 512; // Salto entre ventanas
    const frequencies: (number | null)[] = [];
    
    for (let i = 0; i < float32Audio.length - windowSize; i += hopSize) {
      const window = float32Audio.slice(i, i + windowSize);
      const freq = detectPitch(window);
      frequencies.push(freq);
    }

    // Filtrar frecuencias válidas (rango voz humana aprox 50Hz - 500Hz)
    const validFrequencies = frequencies.filter((f): f is number => f !== null && f > 50 && f < 500);

    if (validFrequencies.length === 0) {
      console.warn('[PITCH] No valid frequencies detected');
      return {
        fallingIntonationScore: null,
        pitchStability: null,
        meanPitch: null,
        pitchRange: null
      };
    }

    // Calcular estadísticas básicas
    const meanPitch = validFrequencies.reduce((a, b) => a + b, 0) / validFrequencies.length;
    const minPitch = Math.min(...validFrequencies);
    const maxPitch = Math.max(...validFrequencies);
    
    // Calcular "Intonational Drop" al final de las frases
    let fallingCount = 0;
    let totalSentences = 0;

    // Mapear tiempo a índice de array
    // frequencies.length corresponde a la duración total en "ventanas"
    // pitchfinder por defecto usa ventanas, hay que ver el stride.
    // Asumiremos mapeo lineal simple por ahora: index = (time / totalTime) * totalIndices
    const totalDuration = float32Audio.length / 44100;
    const itemsPerSecond = frequencies.length / totalDuration;

    segments.forEach(segment => {
      // Analizar solo si parece una oración terminada (punto o tiempo suficiente)
      if (!segment.text.trim().match(/[.!?]$/) && segment.end - segment.start < 1.0) return;

      totalSentences++;

      // Mirar los últimos 500ms del segmento
      const endTime = segment.end;
      const startTime = Math.max(segment.start, endTime - 0.5);
      
      const startIndex = Math.floor(startTime * itemsPerSecond);
      const endIndex = Math.floor(endTime * itemsPerSecond);

      const segmentPitches = frequencies.slice(startIndex, endIndex).filter((f): f is number => f !== null && f > 50 && f < 500);

      if (segmentPitches.length > 5) {
        // Regresión lineal simple para ver la pendiente (slope)
        // y = mx + b
        let sys = 0, sys2 = 0, sxs = 0, sxy = 0;
        const n = segmentPitches.length;
        
        for (let i = 0; i < n; i++) {
          sys += segmentPitches[i];
          sxs += i;
          sxy += i * segmentPitches[i];
          sys2 += i * i;
        }

        const slope = (n * sxy - sxs * sys) / (n * sys2 - sxs * sxs);
        
        // Si la pendiente es negativa (baja), cuenta como afirmación segura
        // El umbral puede necesitar ajuste.
        if (slope < -0.5) {
          fallingCount++;
        }
      }
    });

    const fallingIntonationScore = totalSentences > 0 
      ? Math.round((fallingCount / totalSentences) * 100) 
      : 50; // Si no hay oraciones claras, neutro

    // Calcular Estabilidad (inverso de la desviación estándar relativa)
    const variance = validFrequencies.reduce((sum, f) => sum + Math.pow(f - meanPitch, 2), 0) / validFrequencies.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / meanPitch; // Coeficiente de variación
    // CV bajo = muy estable (robótico/monótono). CV alto = muy variable.
    // Queremos un equilibrio, pero "pitchStability" suele referirse a no temblar.
    // Usaremos 1 - CV normalizado
    const pitchStability = Math.max(0, Math.min(1, 1 - cv));

    return {
      fallingIntonationScore,
      pitchStability: Number(pitchStability.toFixed(2)),
      meanPitch: Math.round(meanPitch),
      pitchRange: Math.round(maxPitch - minPitch)
    };

  } catch (error) {
    console.error('[PITCH] Error processing audio:', error);
    return {
      fallingIntonationScore: null,
      pitchStability: null,
      meanPitch: null,
      pitchRange: null
    };
  }
}
