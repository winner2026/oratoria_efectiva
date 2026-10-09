import { CoachingSession } from './CoachingSession';
import { CommunicationProfile } from './CommunicationProfile';
import { TrainingPrescription, prescribeTraining } from './TrainingPrescription';
import { UserCoachingState } from './TrainingPlan';
import { DiagnosticProfile } from './DiagnosticProfile';
import { VoiceMetrics } from '../voice/VoiceMetrics';
import { ADSOutput } from '../authority/ADS/types';

export type AdaptiveNextStep = {
  nextFocus: string;
  focusChanged: boolean;
  newPrescription: TrainingPrescription;
  curriculumDayProgressed: boolean;
  newCurriculumDay: number;
  reasoning: string;
};

export function determineAdaptiveNextStep(
  currentState: UserCoachingState,
  sessionHistory: CoachingSession[],
  latestProfile: CommunicationProfile,
  latestDiagnostic: DiagnosticProfile,
  metrics?: VoiceMetrics,
  analystFeedback?: ADSOutput
): AdaptiveNextStep {
  let nextFocus = 'Mantenimiento de Autoridad';
  let focusChanged = false;
  let reasoning = 'Continuamos trabajando para consolidar tu solidez vocal.';
  let recommendedExerciseId = 'vocal-tuner';

  // MATRIZ DE SÍNDROMES VOCALES (Nueva lógica)
  if (!metrics || metrics.wordsPerMinute === 0) {
    reasoning = 'Evidencia insuficiente: métricas ausentes o contradictorias. Te sugerimos repetir la grabación.';
    nextFocus = 'Calibración Inicial';
  } else {
    const { 
      wordsPerMinute: wpm, 
      pitchVariation, 
      energyStability, 
      awkwardSilences, 
      strategicPauses 
    } = metrics;

    const isMonotone = (pitchVariation !== null && pitchVariation < 20) && (energyStability !== null && energyStability > 0.8);
    const isLackingFluency = wpm < 110 && awkwardSilences > 2;
    const isRushing = wpm > 170 && (strategicPauses < 1 || (energyStability !== null && energyStability < 0.6));
    const isIntentionalPacing = wpm <= 120 && awkwardSilences === 0 && strategicPauses > 1;

    if (isMonotone) {
      nextFocus = 'Inflexión y Énfasis';
      reasoning = 'Tu energía es constante, pero hay poca variación en el tono. Vamos a practicar el uso de matices melódicos para retener la atención.';
      recommendedExerciseId = 'inflection-practice';
      focusChanged = true;
    } else if (isLackingFluency) {
      nextFocus = 'Cadencia y Fluidez';
      reasoning = 'Detectamos un ritmo bajo con pausas no planificadas. Practicaremos la fluidez para mantener la continuidad de tus ideas.';
      recommendedExerciseId = 'flow-training';
      focusChanged = true;
    } else if (isRushing) {
      nextFocus = 'Pausas Estratégicas';
      reasoning = 'Tu ritmo fue elevado y hubo pocas pausas de descanso. Vamos a practicar pausas estratégicas para dar más peso a tus palabras.';
      recommendedExerciseId = 'pause-control';
      focusChanged = true;
    } else if (isIntentionalPacing) {
      nextFocus = 'Mantener el Ritmo';
      reasoning = 'Hablas con un ritmo pausado pero utilizas pausas muy bien colocadas. Mantén este control estructural.';
      recommendedExerciseId = 'structural-pacing';
    } else if (analystFeedback?.recommended_protocol?.length) {
      // Fallback a recomendación del LLM si no encaja en síndromes críticos
      const proto = analystFeedback.recommended_protocol[0];
      nextFocus = proto;
      reasoning = 'Tu desempeño está equilibrado. Según el análisis cualitativo, tu siguiente desafío es: ' + proto;
    } else {
      nextFocus = 'Mantenimiento';
      reasoning = 'Tu ejecución vocal está dentro de rangos funcionales. Continúa con tus ejercicios de mantenimiento.';
    }
  }

  // En un MVP real generaríamos una 'TrainingPrescription' completa basada en 'recommendedExerciseId'
  let prescription = prescribeTraining(latestDiagnostic); // Fallback old prescriber
  prescription.exerciseTitle = `Misión: ${nextFocus}`;
  prescription.rationale = reasoning;

  // Progresión de curriculum (simplificada)
  const consecutiveImprovements = sessionHistory.slice(-3).filter(s => s.progress?.status === 'IMPROVED').length;
  let curriculumDayProgressed = false;
  let newCurriculumDay = currentState.curriculumDay;

  if (consecutiveImprovements >= 1 && currentState.curriculumDay < 21) {
    curriculumDayProgressed = true;
    newCurriculumDay = currentState.curriculumDay + 1;
  }

  return {
    nextFocus,
    focusChanged,
    newPrescription: prescription,
    curriculumDayProgressed,
    newCurriculumDay,
    reasoning,
  };
}
