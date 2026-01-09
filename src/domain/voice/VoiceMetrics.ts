export type VoiceMetrics = {
  wordsPerMinute: number;
  avgPauseDuration: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number;
  energyStability: number;

  // 🆕 Métricas mejoradas sin costo adicional
  repetitionCount: number; // palabras/frases repetidas innecesariamente
  strategicPauses: number; // pausas bien ubicadas (>0.5s)
  awkwardSilences: number; // silencios incómodos (>2s)
  paceVariability: number; // variación del ritmo (0-1, donde 0.2-0.4 es ideal)
  avgSentenceLength: number; // palabras por frase (ideal: 10-20)
  longSentences: number; // frases >25 palabras
  rhythmConsistency: number; // qué tan consistente es el ritmo (0-1)
  
  // 🎵 Métricas de Entonación (Pitch)
  fallingIntonationScore?: number; // % de frases con tono descendente (Seguridad)
  meanPitch?: number; // Hz
  pitchRange?: number; // Hz

  // 🌈 Métricas Espectrales (Timbre)
  nasalityScore?: number; // 0-100 (Alto = Nasal/Opaco)
  brightnessScore?: number; // 0-100 (Alto = Claro/Brillante)
  depthScore?: number;    // 0-100 (Alto = Voz Profunda/Cuerpo)
};

type TranscriptionSegment = {
  id: number;
  start: number;
  end: number;
  text: string;
};

// 🆕 Detectar palabras repetidas innecesariamente
function detectRepetitions(words: string[]): number {
  let repetitionCount = 0;
  const lowerWords = words.map(w => w.toLowerCase().replace(/[.,!?;:]/g, ''));

  // Detectar repeticiones consecutivas (ej: "bueno bueno", "sí sí sí")
  for (let i = 0; i < lowerWords.length - 1; i++) {
    if (lowerWords[i] === lowerWords[i + 1] && lowerWords[i].length > 2) {
      repetitionCount++;
    }
  }

  // Detectar palabras sobre-utilizadas (más de 5 veces en discurso corto)
  const wordFreq = new Map<string, number>();
  lowerWords.forEach(word => {
    if (word.length > 3) { // Ignorar palabras muy cortas
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  wordFreq.forEach(count => {
    if (count > 5) repetitionCount += (count - 5);
  });

  return repetitionCount;
}

// 🆕 Analizar calidad de pausas
function analyzePauseQuality(pauses: number[]): {
  strategicPauses: number;
  awkwardSilences: number;
} {
  let strategicPauses = 0;
  let awkwardSilences = 0;

  pauses.forEach(pause => {
    if (pause >= 0.5 && pause <= 1.5) {
      strategicPauses++; // Pausas ideales para énfasis
    } else if (pause > 2.0) {
      awkwardSilences++; // Silencios incómodos
    }
  });

  return { strategicPauses, awkwardSilences };
}

// 🆕 Calcular variabilidad del ritmo por segmentos
function calculatePaceVariability(segments: TranscriptionSegment[]): {
  paceVariability: number;
  rhythmConsistency: number;
} {
  const segmentPaces: number[] = [];

  for (const segment of segments) {
    const duration = segment.end - segment.start;
    const wordCount = segment.text.split(/\s+/).length;
    if (duration > 0 && wordCount > 0) {
      const pace = (wordCount / duration) * 60; // WPM del segmento
      segmentPaces.push(pace);
    }
  }

  if (segmentPaces.length < 2) {
    return { paceVariability: 0, rhythmConsistency: 1 };
  }

  const avgPace = segmentPaces.reduce((a, b) => a + b, 0) / segmentPaces.length;
  const variance = segmentPaces.reduce((sum, pace) =>
    sum + Math.pow(pace - avgPace, 2), 0
  ) / segmentPaces.length;
  const stdDev = Math.sqrt(variance);

  // Variabilidad normalizada (0-1)
  const paceVariability = Math.min(1, stdDev / avgPace);

  // Consistencia = inverso de variabilidad
  const rhythmConsistency = Number((1 - paceVariability).toFixed(2));

  return {
    paceVariability: Number(paceVariability.toFixed(2)),
    rhythmConsistency
  };
}

// 🆕 Analizar longitud de frases
function analyzeSentenceLength(transcription: string): {
  avgSentenceLength: number;
  longSentences: number;
} {
  // Dividir por puntos, signos de interrogación o exclamación
  const sentences = transcription
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) {
    return { avgSentenceLength: 0, longSentences: 0 };
  }

  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const longSentences = sentenceLengths.filter(len => len > 25).length;

  return {
    avgSentenceLength: Number(avgSentenceLength.toFixed(1)),
    longSentences
  };
}

export function extractMetrics(
  transcription: string,
  segments: TranscriptionSegment[],
  durationSeconds: number
): VoiceMetrics {
  // Contar palabras (excluyendo muletillas)
  const words = transcription.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Palabras por minuto
  const wordsPerMinute = (wordCount / durationSeconds) * 60;

  // 🔥 MEJORA #1: Detección mejorada de muletillas
  const fillerWords = ['eh', 'ehh', 'ehhh', 'um', 'umm', 'ah', 'ahh', 'este', 'pues', 'o sea', 'bueno', 'entonces', 'como', 'tipo'];
  const fillerCount = words.filter(word =>
    fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, ''))
  ).length;

  // 🔥 MEJORA #1: Detectar repeticiones innecesarias
  const repetitionCount = detectRepetitions(words);

  // Calcular pausas entre segmentos
  const pauses: number[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const gap = segments[i + 1].start - segments[i].end;
    if (gap > 0.1) { // Solo pausas mayores a 100ms
      pauses.push(gap);
    }
  }

  const pauseCount = pauses.length;
  const avgPauseDuration = pauseCount > 0
    ? pauses.reduce((a, b) => a + b, 0) / pauseCount
    : 0;

  // 🔥 MEJORA #3: Análisis de calidad de pausas
  const { strategicPauses, awkwardSilences } = analyzePauseQuality(pauses);

  // 🔥 MEJORA #2: Variabilidad del ritmo y consistencia
  const { paceVariability, rhythmConsistency } = calculatePaceVariability(segments);

  // Variación de tono estimada (basada en variación de duración de segmentos)
  const segmentDurations = segments.map(s => s.end - s.start);
  const avgDuration = segmentDurations.reduce((a, b) => a + b, 0) / segmentDurations.length;
  const variance = segmentDurations.reduce((sum, d) => sum + Math.pow(d - avgDuration, 2), 0) / segmentDurations.length;
  const pitchVariation = Math.sqrt(variance) / avgDuration;

  // Estabilidad de energía (estimada por consistencia en longitud de texto por segmento)
  const wordsPerSegment = segments.map(s => s.text.split(/\s+/).length);
  const avgWordsPerSegment = wordsPerSegment.reduce((a, b) => a + b, 0) / wordsPerSegment.length;
  const energyVariance = wordsPerSegment.reduce(
    (sum, w) => sum + Math.pow(w - avgWordsPerSegment, 2),
    0
  ) / wordsPerSegment.length;
  const energyStability = 1 / (1 + Math.sqrt(energyVariance));

  // 🔥 MEJORA #4: Análisis de longitud de frases
  const { avgSentenceLength, longSentences } = analyzeSentenceLength(transcription);

  return {
    // Métricas originales
    wordsPerMinute: Math.round(wordsPerMinute),
    avgPauseDuration: Number(avgPauseDuration.toFixed(2)),
    pauseCount,
    fillerCount,
    pitchVariation: Number(pitchVariation.toFixed(2)),
    energyStability: Number(energyStability.toFixed(2)),

    // 🆕 Métricas mejoradas
    repetitionCount,
    strategicPauses,
    awkwardSilences,
    paceVariability,
    avgSentenceLength,
    longSentences,
    rhythmConsistency,
  };
}
