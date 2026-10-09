import { WeaknessAssessment, evaluateWeaknesses } from './Weakness';
import { CommunicationProfile, buildCommunicationProfile } from './CommunicationProfile';

export type DiagnosticProfile = {
  primaryWeakness: WeaknessAssessment | null;
  secondaryWeaknesses: WeaknessAssessment[];
  strengths: string[];
  overallHealthScore: number; // Explicable Composite Authority Score Index (0 a 100)
  behavioralSummary: string; // Explicación objetiva y no juzgadora
  evaluatedAt: string;
};

export function buildDiagnosticProfile(
  metrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pauseCount: number;
    fillerCount: number;
    pitchVariation: number | null;
    energyStability: number | null;
  },
  authorityScore: {
    score: number;
    strengths: string[];
    weaknesses: string[];
  }
): DiagnosticProfile {
  const communicationProfile = buildCommunicationProfile(metrics);
  const evaluatedWeaknesses = evaluateWeaknesses(metrics);

  const primaryWeakness = evaluatedWeaknesses.length > 0 ? evaluatedWeaknesses[0] : null;
  const secondaryWeaknesses = evaluatedWeaknesses.length > 1 ? evaluatedWeaknesses.slice(1) : [];

  // No atribuir fortalezas no medidas cuando una dimensión es desconocida.
  let behavioralSummary = '';
  if (primaryWeakness) {
    behavioralSummary = `En esta muestra, detectamos un patrón que conviene revisar: ${primaryWeakness.description.toLowerCase()}`;
  } else {
    const unavailableMetrics: string[] = [];
    if (metrics.pitchVariation === null) unavailableMetrics.push('variación tonal');
    if (metrics.energyStability === null) unavailableMetrics.push('estabilidad energética');

    if (unavailableMetrics.length > 0) {
      behavioralSummary = `No se detectaron debilidades claras en las métricas disponibles. No puede confirmarse una evaluación vocal completa porque no se pudo medir: ${unavailableMetrics.join(' y ')}.`;
    } else {
      behavioralSummary = 'No se detectaron debilidades destacadas en las métricas evaluadas de esta muestra. El resultado es orientativo y no demuestra por sí solo una técnica vocal excelente.';
    }
  }

  return {
    primaryWeakness,
    secondaryWeaknesses,
    strengths: authorityScore.strengths,
    overallHealthScore: communicationProfile.overallIndex,
    behavioralSummary,
    evaluatedAt: new Date().toISOString(),
  };
}
