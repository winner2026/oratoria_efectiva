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
    console.error('[PITCH] Audio decoding failed; refusing to interpret encoded bytes as PCM:', ffmpegErr);
    throw new Error('Audio decoding failed: input is not a supported WAV or ffmpeg-decodable audio format.');
  }
}

export async function analyzePitch(
  audioBuffer: Buffer,
  segments: { start: number; end: number; text: string }[]
): Promise<IntonationMetrics> {
  try {
    console.log('[PITCH] Decoding audio...');
    const { audio: float32Audio, sampleRate } = await decodeAudio(audioBuffer);
    
    const validSegments = segments.filter(
      (segment) =>
        Number.isFinite(segment.start) &&
        Number.isFinite(segment.end) &&
        segment.start >= 0 &&
        segment.end > segment.start &&
        typeof segment.text === 'string'
    );

    // Sin marcas temporales de habla fiables, no atribuir tono a ruido o silencio.
    if (validSegments.length === 0) {
      return {
        fallingIntonationScore: null,
        pitchStability: null,
        meanPitch: null,
        pitchRange: null
      };
    }

    // Detectar F0 con YIN (bueno para estimación de voz)
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
    const validFrequencies = frequencies.filter((f, index): f is number => {
      if (f === null || !Number.isFinite(f) || f <= 50 || f >= 500) return false;
      const frameTime = (index * hopSize) / sampleRate;
      return validSegments.some(
        (segment) => frameTime >= segment.start - 0.1 && frameTime <= segment.end + 0.1
      );
    });

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
    let analyzedSentences = 0;

    // Mapear tiempo a índice de array
    // frequencies.length corresponde a la duración total en "ventanas"
    // pitchfinder por defecto usa ventanas, hay que ver el stride.
    // Asumiremos mapeo lineal simple por ahora: index = (time / totalTime) * totalIndices
    // Cada estimación de F0 corresponde al inicio de una ventana separada por hopSize.
    // Usar sampleRate/hopSize evita distorsionar los tiempos en WAV con otra frecuencia.
    const itemsPerSecond = sampleRate / hopSize;

    validSegments.forEach(segment => {
      // Analizar solo si parece una oración terminada (punto o tiempo suficiente)
      if (!segment.text.trim().match(/[.!?]$/) && segment.end - segment.start < 1.0) return;

      // Mirar los últimos 500ms del segmento
      const endTime = segment.end;
      const startTime = Math.max(segment.start, endTime - 0.5);
      
      const startIndex = Math.max(0, Math.floor(startTime * itemsPerSecond));
      const endIndex = Math.min(frequencies.length, Math.ceil(endTime * itemsPerSecond));

      const segmentPitches = frequencies.slice(startIndex, endIndex).filter((f): f is number => f !== null && f > 50 && f < 500);

      if (segmentPitches.length > 5) {
        analyzedSentences++;
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

    const fallingIntonationScore = analyzedSentences > 0
      ? Math.round((fallingCount / analyzedSentences) * 100)
      : null; // Sin frases analizables no inventamos una puntuación

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
