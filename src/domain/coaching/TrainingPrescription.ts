import { DiagnosticProfile } from './DiagnosticProfile';
import { WeaknessType } from './Weakness';

export type TrainingPrescription = {
  targetExerciseId: string;
  exerciseTitle: string;
  rationale: string;
  expectedBenefit: string;
  recommendedDurationMinutes: number;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MAINTENANCE';
  customRoute: string;
};

// Mapeo exhaustivo entre debilidades diagnosticadas y ejercicios del Gimnasio Vocal
const WEAKNESS_TO_EXERCISE_MAP: Record<WeaknessType, { exerciseId: string; title: string; route: string; rationale: string }> = {
  RHYTHM: {
    exerciseId: 'mental-sync',
    title: 'Misión: Sincronización (Ritmo)',
    route: '/practice/reading',
    rationale: 'Tu velocidad de emisión requiere regulación. Entrena lectura sincronizada para estabilizar tu cadencia natural.',
  },
  PAUSE_CONTROL: {
    exerciseId: 'authority-pause',
    title: 'Misión: Pausa de Autoridad',
    route: '/practice/pause',
    rationale: 'Muestra con pausas breves o escasas. Practica la inserción de silencios de 3 segundos para estructurar tus ideas.',
  },
  FILLER_OVERUSE: {
    exerciseId: 'filler-killer',
    title: 'Misión: Limpieza (Filler Killer)',
    route: '/practice/filler-killer',
    rationale: 'Las muletillas frenan la fluidez de tu mensaje. Entrena improvisación con penalización por muletillas.',
  },
  PITCH_VARIATION: {
    exerciseId: 'vocal-tuner',
    title: 'Misión: Afinador Vocal',
    route: '/practice/intonation',
    rationale: 'Tu rango tonal tiende a ser uniforme. Modula picos y valles melódicos observando el espectro de frecuencia.',
  },
  ENERGY_STABILITY: {
    exerciseId: 'stability-check',
    title: 'Misión: Estabilidad Diafragmática',
    route: '/practice/breathing',
    rationale: 'El flujo de aire oscila al final de las frases. Ejecuta la exhalación "SSSS" constante de 20 segundos.',
  },
  ARTICULATION_CLARITY: {
    exerciseId: 'articulation-drill',
    title: 'Misión: Dicción Exagerada',
    route: '/practice/articulation',
    rationale: 'Se observan imprecisiones en fonemas complejos. Ejecuta el drill de trabalenguas con precisión >90%.',
  },
  BREVITY_SYNTHESIS: {
    exerciseId: 'less-is-more',
    title: 'Misión: Síntesis (12 Palabras)',
    route: '/practice/synthesis',
    rationale: 'Tus ideas requieren concisión. Destila cualquier afirmación a un máximo de 12 palabras.',
  },
  ASCENDING_INFLECTION: {
    exerciseId: 'sentence-closure',
    title: 'Misión: Cierre Seguro',
    route: '/practice/inflection',
    rationale: 'Detectamos entonación ascendente al cerrar afirmaciones ("preguntas fantasma"). Entrena cierres descendentes con firmeza.',
  },
};

export function prescribeTraining(profile: DiagnosticProfile): TrainingPrescription {
  if (!profile.primaryWeakness) {
    return {
      targetExerciseId: 'structured-minute',
      exerciseTitle: 'Misión: Estructura (Minuto Estructurado)',
      rationale: 'Rendimiento vocal óptimo. Mantén la agilidad mental mediante la práctica de estructura en 60 segundos.',
      expectedBenefit: 'Dominio absoluto de la estructura bajo presión.',
      recommendedDurationMinutes: 3,
      priorityLevel: 'MAINTENANCE',
      customRoute: '/practice/structured-minute',
    };
  }

  const mapping = WEAKNESS_TO_EXERCISE_MAP[profile.primaryWeakness.type] || {
    exerciseId: 'voice-scanner',
    title: 'Misión: Escáner de Voz',
    route: '/practice?mode=voice',
    rationale: 'Realizar un escaneo de calibración vocal general.',
  };

  const priorityLevel = profile.primaryWeakness.severity > 0.7 ? 'CRITICAL' : profile.primaryWeakness.severity > 0.4 ? 'HIGH' : 'MAINTENANCE';

  return {
    targetExerciseId: mapping.exerciseId,
    exerciseTitle: mapping.title,
    rationale: `${profile.primaryWeakness.description} ${mapping.rationale}`,
    expectedBenefit: `Reducir la severidad de ${profile.primaryWeakness.label}.`,
    recommendedDurationMinutes: profile.primaryWeakness.severity > 0.7 ? 5 : 3,
    priorityLevel,
    customRoute: mapping.route,
  };
}
