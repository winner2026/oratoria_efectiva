import { DiagnosticProfile } from './DiagnosticProfile';
import { WeaknessType } from './Weakness';

export type TrainingPrescription = {
  targetExerciseId: string;
  exerciseTitle: string;
  rationale: string;
  instruction: string;
  expectedBenefit: string;
  recommendedDurationMinutes: number;
  priorityLevel: 'CRITICAL' | 'HIGH' | 'MAINTENANCE';
  customRoute: string;
};

const WEAKNESS_TO_EXERCISE_MAP: Record<WeaknessType, { exerciseId: string; title: string; route: string; rationale: string; instructions: string[] }> = {
  RHYTHM: {
    exerciseId: 'mental-sync',
    title: 'Misión: Sincronización (Ritmo)',
    route: '/practice/reading',
    rationale: 'Tu velocidad de emisión requiere regulación. Entrena lectura sincronizada para estabilizar tu cadencia natural.',
    instructions: [
      'Lee un texto siguiendo un metrónomo o marcador visual para asimilar una velocidad constante y evitar aceleraciones.',
      'Lee en voz alta e intenta prolongar deliberadamente las vocales de cada palabra para obligarte a bajar el ritmo.',
      'Grábate contando del 1 al 20, asegurándote de que cada número dure exactamente un segundo entero en tu boca.'
    ],
  },
  PAUSE_CONTROL: {
    exerciseId: 'authority-pause',
    title: 'Misión: Pausa de Autoridad',
    route: '/practice/pause',
    rationale: 'Practica la inserción de silencios de 2 segundos antes de ideas clave para estructurarlas.',
    instructions: [
      'Lee un párrafo en voz alta. Antes de la idea más importante, haz una pausa breve de 2 segundos y continúa con firmeza.',
      'Habla durante un minuto sobre tu día. Cada vez que termines una frase, muerde tu labio inferior durante 2 segundos antes de seguir.',
      'Toma un texto y haz una marca cada 10 palabras. Oblígate a hacer un silencio total de 2 segundos en cada marca.'
    ],
  },
  FILLER_OVERUSE: {
    exerciseId: 'filler-killer',
    title: 'Misión: Limpieza (Filler Killer)',
    route: '/practice/filler-killer',
    rationale: 'Las muletillas frenan la fluidez de tu mensaje. Entrena improvisación con penalización por muletillas.',
    instructions: [
      'Improvisa durante 1 minuto sobre un tema aleatorio. Si notas que vas a decir una muletilla, fuérzate a hacer silencio.',
      'Explica las reglas de tu juego favorito. Pídele a alguien (o a ti mismo) que aplauda fuerte cada vez que uses un ah, eh o mmm.',
      'Habla lento y respira hondo por la nariz cada vez que sientas que tu cerebro necesita tiempo para pensar la siguiente palabra.'
    ],
  },
  PITCH_VARIATION: {
    exerciseId: 'vocal-tuner',
    title: 'Misión: Afinador Vocal',
    route: '/practice/intonation',
    rationale: 'Tu rango tonal tiende a ser uniforme. Modula picos y valles melódicos observando el espectro de frecuencia.',
    instructions: [
      'Exagera las variaciones de tono al hablar: sube el tono drásticamente al hacer preguntas y bájalo al máximo al afirmar.',
      'Lee un cuento infantil en voz alta, exagerando las voces de distintos personajes para forzar tu rango tonal.',
      'Elige una frase plana y dila de 3 formas distintas: como un secreto (susurrado grave), como una sorpresa (agudo) y como una orden.'
    ],
  },
  ENERGY_STABILITY: {
    exerciseId: 'stability-check',
    title: 'Misión: Estabilidad Diafragmática',
    route: '/practice/breathing',
    rationale: 'El flujo de aire oscila al final de las frases. Ejecuta la exhalación "SSSS" constante de 20 segundos.',
    instructions: [
      'Toma aire profundamente y exhálalo haciendo un sonido "SSSS" continuo. Intenta mantener la intensidad estable por 20 segundos.',
      'Lee una oración larga de un solo respiro. Asegúrate de que la última palabra suene exactamente con la misma fuerza que la primera.',
      'Coloca tus manos en tu abdomen y empuja hacia afuera mientras hablas. Evita que tu voz se apague al llegar al punto y aparte.'
    ],
  },
  ARTICULATION_CLARITY: {
    exerciseId: 'articulation-drill',
    title: 'Misión: Dicción Exagerada',
    route: '/practice/articulation',
    rationale: 'Se observan imprecisiones en fonemas complejos. Ejecuta el drill de trabalenguas con precisión >90%.',
    instructions: [
      'Coloca un obstáculo (como un lápiz) entre los dientes y lee un párrafo forzando la exageración de cada sílaba.',
      'Lee un texto en voz alta exagerando enormemente el movimiento de tus labios y tu mandíbula en cada vocal.',
      'Practica tres trabalenguas seguidos de forma lenta pero sobre-articulada. No importa la velocidad, solo la claridad.'
    ],
  },
  BREVITY_SYNTHESIS: {
    exerciseId: 'less-is-more',
    title: 'Misión: Síntesis (12 Palabras)',
    route: '/practice/synthesis',
    rationale: 'Tus ideas requieren concisión. Destila cualquier afirmación a un máximo de 12 palabras.',
    instructions: [
      'Explica a qué te dedicas usando exactamente 12 palabras. Cuenta mentalmente y no te pases de límite.',
      'Resume la trama de tu película favorita en una sola oración sin usar la letra "y" o la palabra "entonces".',
      'Imagina que cada palabra que dices cuesta dinero. Resume tu objetivo del día gastando un máximo de 10 palabras.'
    ],
  },
  ASCENDING_INFLECTION: {
    exerciseId: 'sentence-closure',
    title: 'Misión: Cierre Seguro',
    route: '/practice/inflection',
    rationale: 'Detectamos entonación ascendente al cerrar afirmaciones ("preguntas fantasma"). Entrena cierres descendentes con firmeza.',
    instructions: [
      'Afirma 5 frases cortas asegurándote de que la última sílaba caiga drásticamente hacia los tonos graves de tu voz.',
      'Imagina que estás golpeando la mesa con el puño en la última palabra de tu oración. Deja caer tu tono vocal junto con el golpe.',
      'Acompaña el final de tus frases bajando físicamente el mentón hacia tu pecho para forzar la nota grave del cierre.'
    ],
  },
};

export function prescribeTraining(profile: DiagnosticProfile): TrainingPrescription {
  if (!profile.primaryWeakness) {
    return {
      targetExerciseId: 'structured-minute',
      exerciseTitle: 'Misión: Estructura (Minuto Estructurado)',
      rationale: 'Rendimiento vocal óptimo. Mantén la agilidad mental mediante la práctica de estructura en 60 segundos.',
      instruction: 'Habla 60 segundos con la estructura: Introducción (10s), Desarrollo (40s) y Cierre firme (10s).',
      expectedBenefit: 'Dominio absoluto de la estructura bajo presión.',
      recommendedDurationMinutes: 3,
      priorityLevel: 'MAINTENANCE',
      customRoute: '/practice/structured-minute',
    };
  }

  const mapping = WEAKNESS_TO_EXERCISE_MAP[profile.primaryWeakness.type];
  if (!mapping) {
    return {
      targetExerciseId: 'voice-scanner',
      exerciseTitle: 'Misión: Escáner de Voz',
      rationale: 'Realizar un escaneo de calibración vocal general.',
      instruction: 'Graba 30 segundos leyendo el texto sugerido en pantalla para recalibrar los sensores acústicos.',
      expectedBenefit: 'Recalibración de línea base.',
      recommendedDurationMinutes: 3,
      priorityLevel: 'MAINTENANCE',
      customRoute: '/practice?mode=voice',
    };
  }

  const priorityLevel = profile.primaryWeakness.severity > 0.7 ? 'CRITICAL' : profile.primaryWeakness.severity > 0.4 ? 'HIGH' : 'MAINTENANCE';

  // Select a random instruction for variety
  const randomInstruction = mapping.instructions[Math.floor(Math.random() * mapping.instructions.length)];

  return {
    targetExerciseId: mapping.exerciseId,
    exerciseTitle: mapping.title,
    rationale: `${profile.primaryWeakness.description} ${mapping.rationale}`,
    instruction: randomInstruction,
    expectedBenefit: `Reducir la severidad de ${profile.primaryWeakness.label}.`,
    recommendedDurationMinutes: profile.primaryWeakness.severity > 0.7 ? 5 : 3,
    priorityLevel,
    customRoute: mapping.route,
  };
}
