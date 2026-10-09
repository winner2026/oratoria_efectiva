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
    pitchVariation: number;
    energyStability: number;
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

  // Redacción no juzgadora basada estrictamente en comportamientos observables
  let behavioralSummary = '';
  if (primaryWeakness) {
    behavioralSummary = `En esta muestra, detectamos características asociadas a menor firmeza percibida: ${primaryWeakness.description.toLowerCase()}`;
  } else {
    behavioralSummary = 'La muestra demuestra excelente estabilidad energética, ritmo constante y pausas estratégicas bien estructuradas.';
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
