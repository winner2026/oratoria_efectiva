import type { TranscriptionSegment } from '@/infrastructure/openai/transcription';

export type ExtractedMetrics = {
  wordsPerMinute: number;
  avgPauseDuration: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number;
  energyStability: number;
};

const FILLER_WORDS = [
  'eh',
  'emm', 'mm', 'mmm',
  'este', 'esta',
  'o sea',
  'pues',
  'bueno',
  'como',
  'digamos',
  'entonces',
  'básicamente'
];

export function extractMetrics(
  text: string,
  segments: TranscriptionSegment[],
  durationInSeconds: number
): ExtractedMetrics {
  // Contar palabras
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Calcular palabras por minuto
  const minutes = durationInSeconds / 60;
  const wordsPerMinute = minutes > 0 ? Math.round(wordCount / minutes) : 0;

  // Detectar pausas desde segmentos
  const pauses: number[] = [];
  for (let i = 1; i < segments.length; i++) {
    const gap = segments[i].start - segments[i - 1].end;
    if (gap > 0.4) {  // Pausas mayores a 400ms
      pauses.push(gap);
    }
  }

  const pauseCount = pauses.length;
  const avgPauseDuration = pauses.length > 0
    ? pauses.reduce((a, b) => a + b, 0) / pauses.length
    : 0;

  // Detectar muletillas
  const textLower = text.toLowerCase();
  let fillerCount = 0;

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'g');
    const matches = textLower.match(regex);
    if (matches) {
      fillerCount += matches.length;
    }
  }

  // Métricas de audio (placeholders por ahora - requieren análisis de audio real)
  // TODO: Implementar análisis de frecuencia de audio para estas métricas
  const pitchVariation = 0.2;  // Placeholder
  const energyStability = 0.6;  // Placeholder

  return {
    wordsPerMinute,
    avgPauseDuration,
    pauseCount,
    fillerCount,
    pitchVariation,
    energyStability
  };
}
