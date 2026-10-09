import { WeaknessAssessment, evaluateWeaknesses } from './Weakness';

export type DimensionScore = {
  score: number; // 0 a 100
  label: string;
  status: 'OPTIMAL' | 'STABLE' | 'NEEDS_WORK' | 'CRITICAL_BOTTLENECK';
};

export type CommunicationProfile = {
  voice: {
    rhythmScore: number;
    pauseScore: number;
    pitchScore: number;
    energyScore: number;
    overall: number;
  };
  fluency: {
    fillerScore: number;
    flowScore: number;
    overall: number;
  };
  presence: {
    authorityScore: number;
    stabilityScore: number;
    overall: number;
  };
  overallIndex: number;
  bottleneck: WeaknessAssessment | null;
  evaluatedAt: string;
};

export function calculateDimensionScore(rawSeverity: number): number {
  // Convertir severidad (0.0 a 1.0) a puntaje de dimensión (100 a 0)
  return Math.max(0, Math.min(100, Math.round((1 - rawSeverity) * 100)));
}

export function buildCommunicationProfile(metrics: {
  wordsPerMinute: number;
  avgPauseDuration: number;
  pauseCount: number;
  fillerCount: number;
  pitchVariation: number;
  energyStability: number;
}): CommunicationProfile {
  const weaknesses = evaluateWeaknesses(metrics);

  // 1. Puntajes específicos de la dimensión Voice
  const rhythmSeverity = metrics.wordsPerMinute > 165
    ? Math.min(1.0, (metrics.wordsPerMinute - 165) / 45)
    : metrics.wordsPerMinute < 105 && metrics.wordsPerMinute > 0
    ? Math.min(1.0, (105 - metrics.wordsPerMinute) / 35)
    : 0.1;

  const pauseSeverity = metrics.avgPauseDuration < 0.45 || metrics.pauseCount < 2
    ? Math.min(1.0, (0.45 - metrics.avgPauseDuration) / 0.3)
    : 0.15;

  const pitchSeverity = metrics.pitchVariation < 0.28
    ? Math.min(1.0, (0.28 - metrics.pitchVariation) / 0.22)
    : 0.15;

  const energySeverity = metrics.energyStability < 0.65
    ? Math.min(1.0, (0.65 - metrics.energyStability) / 0.4)
    : 0.15;

  const rhythmScore = calculateDimensionScore(rhythmSeverity);
  const pauseScore = calculateDimensionScore(pauseSeverity);
  const pitchScore = calculateDimensionScore(pitchSeverity);
  const energyScore = calculateDimensionScore(energySeverity);

  const voiceOverall = Math.round(rhythmScore * 0.3 + pauseScore * 0.3 + pitchScore * 0.2 + energyScore * 0.2);

  // 2. Puntajes específicos de Fluency
  const fillerSeverity = metrics.fillerCount > 2 ? Math.min(1.0, metrics.fillerCount / 7) : 0.05;
  const fillerScore = calculateDimensionScore(fillerSeverity);
  const flowScore = Math.round((voiceOverall + fillerScore) / 2);
  const fluencyOverall = Math.round(fillerScore * 0.6 + flowScore * 0.4);

  // 3. Puntajes de Presence
  const stabilityScore = energyScore;
  const authorityScore = Math.round(pauseScore * 0.35 + rhythmScore * 0.25 + energyScore * 0.25 + pitchScore * 0.15);
  const presenceOverall = Math.round(authorityScore * 0.6 + stabilityScore * 0.4);

  // 4. Explicable Composite Authority Index
  const overallIndex = Math.round(
    rhythmScore * 0.25 +
    pauseScore * 0.20 +
    energyScore * 0.20 +
    pitchScore * 0.15 +
    fillerScore * 0.10 +
    presenceOverall * 0.10
  );

  // 5. Detectar el Verdadero Cuello de Botella (Bottleneck)
  const bottleneck = weaknesses.length > 0 ? weaknesses[0] : null;

  return {
    voice: {
      rhythmScore,
      pauseScore,
      pitchScore,
      energyScore,
      overall: voiceOverall,
    },
    fluency: {
      fillerScore,
      flowScore,
      overall: fluencyOverall,
    },
    presence: {
      authorityScore,
      stabilityScore,
      overall: presenceOverall,
    },
    overallIndex,
    bottleneck,
    evaluatedAt: new Date().toISOString(),
  };
}
