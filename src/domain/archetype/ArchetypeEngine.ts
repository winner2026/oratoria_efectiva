/**
 * Motor Bioacústico de Arquetipos de Voz (ArchetypeEngine)
 * Clasificación vectorial determinista basada en las 12 dimensiones del Onboarding.
 */

export interface AcousticTargetVector {
  wpmRange: [number, number];       // [mínimo, máximo] WPM óptimo
  pauseDurationSec: number;         // Duración ideal de pausa (segundos)
  pauseFrequencyPerMin: number;     // Pausas ideales por minuto
  pitchVariationHz: number;         // Rango dinámico F0 deseado (Hz)
  energyStability: number;          // Estabilidad RMS mínima (0.0 a 1.0)
  fillerToleranceMaxPct: number;    // % máximo de muletillas tolerado
}

export interface VoiceArchetype {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  themeColor: string;
  glowColor: string;
  badgeGrade: string;
  acousticVector: AcousticTargetVector;
  coreDimensions: {
    consistency: number; // Max 20
    clarity: number;     // Max 17
    rhythm: number;      // Max 25
    authority: number;   // Max 15
    regulation: number;  // Max 15
  };
  recommendedTrainingFocus: string;
  actionablePrescription: string;
}

// Catálogo de 8 Arquetipos Forenses Distintos
export const VOICE_ARCHETYPES: Record<string, VoiceArchetype> = {
  // 1. Líder Magnético (Calma imponente, peso pectoral y presencia indiscutible)
  LIDER_MAGNETICO: {
    id: "LIDER_MAGNETICO",
    name: "Líder Magnético",
    code: "ARC-01-LM",
    tagline: "Autoridad serena que inspira respeto natural sin alzar la voz",
    description: "Voz con gran resonancia pectoral, tempo deliberado y silencios de poder que capturan la atención sin esfuerzo.",
    themeColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.6)",
    badgeGrade: "A+",
    acousticVector: {
      wpmRange: [122, 138],
      pauseDurationSec: 1.1,
      pauseFrequencyPerMin: 12,
      pitchVariationHz: 35,
      energyStability: 0.82,
      fillerToleranceMaxPct: 1.5,
    },
    coreDimensions: {
      consistency: 19,
      clarity: 16,
      rhythm: 22,
      authority: 15,
      regulation: 14,
    },
    recommendedTrainingFocus: "Anclaje de diafragma y pausas de soberanía de 1.2s",
    actionablePrescription: "Disminuir la velocidad en aperturas y rematar frases con inflexión tonal descendente.",
  },

  // 2. Comandante Estratégico (Directo, sobrio, decisivo en alta tensión)
  COMANDANTE_ESTRATEGICO: {
    id: "COMANDANTE_ESTRATEGICO",
    name: "Comandante Estratégico",
    code: "ARC-02-CE",
    tagline: "Firmeza ejecutiva implacable para escenarios de directorio y crisis",
    description: "Cadencia marcial, economía verbal estricta y modulación libre de titubeos diseñada para la toma de decisiones críticas.",
    themeColor: "#0ea5e9",
    glowColor: "rgba(14, 165, 233, 0.6)",
    badgeGrade: "A",
    acousticVector: {
      wpmRange: [120, 134],
      pauseDurationSec: 1.3,
      pauseFrequencyPerMin: 14,
      pitchVariationHz: 28,
      energyStability: 0.86,
      fillerToleranceMaxPct: 0.8,
    },
    coreDimensions: {
      consistency: 18,
      clarity: 17,
      rhythm: 20,
      authority: 15,
      regulation: 15,
    },
    recommendedTrainingFocus: "Puntuación acústica y cierre quirúrgico de enunciados",
    actionablePrescription: "Eliminar conectores dubitativos y sostener la mirada durante la pausa previa a la cifra clave.",
  },

  // 3. Persuasor de Alto Cierre (Ágil, asertivo, maestro de la inflexión comercial)
  PERSUASOR_ALTO_CIERRE: {
    id: "PERSUASOR_ALTO_CIERRE",
    name: "Persuasor de Alto Cierre",
    code: "ARC-03-PAC",
    tagline: "Inflexión psicológica descendente que desactiva objeciones y cierra acuerdos",
    description: "Ritmo modulado con micro-pausas estratégicas que generan anticipación y transmiten convicción absoluta.",
    themeColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.6)",
    badgeGrade: "A",
    acousticVector: {
      wpmRange: [136, 152],
      pauseDurationSec: 0.85,
      pauseFrequencyPerMin: 16,
      pitchVariationHz: 48,
      energyStability: 0.76,
      fillerToleranceMaxPct: 1.2,
    },
    coreDimensions: {
      consistency: 17,
      clarity: 16,
      rhythm: 24,
      authority: 14,
      regulation: 13,
    },
    recommendedTrainingFocus: "Tono descendente de certeza en propuestas económicas",
    actionablePrescription: "Evitar el tono interrogativo final (uptalk) al mencionar precios o compromisos.",
  },

  // 4. Orador Visionario / Apasionado (Energía contagiosa para grandes auditorios)
  ORADOR_VISIONARIO: {
    id: "ORADOR_VISIONARIO",
    name: "Orador Visionario",
    code: "ARC-04-OV",
    tagline: "Energía vibrante y amplitud armónica que conmueve y moviliza multitudes",
    description: "Gran rango melódico, variaciones rítmicas intencionales y proyección faríngea que domina espacios físicos y digitales.",
    themeColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.6)",
    badgeGrade: "A+",
    acousticVector: {
      wpmRange: [142, 164],
      pauseDurationSec: 1.05,
      pauseFrequencyPerMin: 15,
      pitchVariationHz: 65,
      energyStability: 0.74,
      fillerToleranceMaxPct: 2.0,
    },
    coreDimensions: {
      consistency: 16,
      clarity: 15,
      rhythm: 25,
      authority: 13,
      regulation: 14,
    },
    recommendedTrainingFocus: "Apertura laríngea y curva melódica en transiciones",
    actionablePrescription: "Modular de suave a potente para marcar los clímax de la narrativa.",
  },

  // 5. Comunicador Cristalino (Articulación precisa, pedagógica y libre de fricción)
  COMUNICADOR_CRISTALINO: {
    id: "COMUNICADOR_CRISTALINO",
    name: "Comunicador Cristalino",
    code: "ARC-05-CC",
    tagline: "Estructura impecable y dicción nítida donde cada palabra cuenta",
    description: "Alineación fono-respiratoria perfecta, velocidad estable y claridad de consonantes ideal para consultores, docentes y técnicos.",
    themeColor: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.6)",
    badgeGrade: "A+",
    acousticVector: {
      wpmRange: [130, 144],
      pauseDurationSec: 0.65,
      pauseFrequencyPerMin: 18,
      pitchVariationHz: 38,
      energyStability: 0.84,
      fillerToleranceMaxPct: 0.5,
    },
    coreDimensions: {
      consistency: 19,
      clarity: 17,
      rhythm: 23,
      authority: 12,
      regulation: 14,
    },
    recommendedTrainingFocus: "Apertura mandibular y erradicación total de muletillas de transición",
    actionablePrescription: "Sustituir 'o sea' y 'este' por pausas silenciosas de 0.5 segundos.",
  },

  // 6. Ancla de Calma Neuro-Vocal (Resiliencia fisiológica frente al pánico escénico)
  ANCLA_NEUROVOCAL: {
    id: "ANCLA_NEUROVOCAL",
    name: "Ancla de Calma Neuro-Vocal",
    code: "ARC-06-ANV",
    tagline: "Regulación autonómica que frena la taquilalia y el temblor por ansiedad",
    description: "Enfocado en disolver el nudo en la garganta y restaurar el flujo de aire continuo para hablar con aplomo sostenido.",
    themeColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.6)",
    badgeGrade: "B+",
    acousticVector: {
      wpmRange: [118, 132],
      pauseDurationSec: 1.25,
      pauseFrequencyPerMin: 12,
      pitchVariationHz: 32,
      energyStability: 0.88,
      fillerToleranceMaxPct: 1.8,
    },
    coreDimensions: {
      consistency: 16,
      clarity: 15,
      rhythm: 19,
      authority: 12,
      regulation: 15,
    },
    recommendedTrainingFocus: "Activación vagal mediante exhalación lenta y fonación apoyada",
    actionablePrescription: "Iniciar cada frase en el fondo de la exhalación para neutralizar el temblor laríngeo.",
  },

  // 7. Autoridad Analítica (Argumentación sobria para profesionales de alta exigencia)
  AUTORIDAD_ANALITICA: {
    id: "AUTORIDAD_ANALITICA",
    name: "Autoridad Analítica",
    code: "ARC-07-AA",
    tagline: "Densidad de ideas y solvencia intelectual sin arrogancia",
    description: "Voz sobria, pausada y de tono uniforme que transmite exactitud matemática y rigurosidad técnica incuestionable.",
    themeColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.6)",
    badgeGrade: "A",
    acousticVector: {
      wpmRange: [126, 140],
      pauseDurationSec: 0.95,
      pauseFrequencyPerMin: 15,
      pitchVariationHz: 30,
      energyStability: 0.83,
      fillerToleranceMaxPct: 1.0,
    },
    coreDimensions: {
      consistency: 18,
      clarity: 17,
      rhythm: 21,
      authority: 14,
      regulation: 13,
    },
    recommendedTrainingFocus: "Modulación de matices para evitar el aplanamiento melódico",
    actionablePrescription: "Resaltar con volumen y micro-pausa la palabra nuclear de cada argumento.",
  },

  // 8. Resonador de Conexión Empática (Calidez y cercanía para líderes humanos)
  RESONADOR_EMPATICO: {
    id: "RESONADOR_EMPATICO",
    name: "Resonador de Conexión Empática",
    code: "ARC-08-RCE",
    tagline: "Calidez vocal y cercanía relacional que genera apertura inmediata",
    description: "Timbre cálido con armónicos enriquecidos, ritmo accesible y tonalidad abierta que genera confianza instantánea.",
    themeColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.6)",
    badgeGrade: "A",
    acousticVector: {
      wpmRange: [132, 146],
      pauseDurationSec: 0.8,
      pauseFrequencyPerMin: 14,
      pitchVariationHz: 45,
      energyStability: 0.78,
      fillerToleranceMaxPct: 1.5,
    },
    coreDimensions: {
      consistency: 17,
      clarity: 16,
      rhythm: 22,
      authority: 13,
      regulation: 14,
    },
    recommendedTrainingFocus: "Proyección con sonrisa fonatoria y respiración intercostal",
    actionablePrescription: "Suavizar los ataques vocales glóticos para invitar a la conversación colaborativa.",
  },
};

/**
 * Motor de Clasificación Vectorial Multivariado
 * Evalúa los patrones de respuesta y asigna determinísticamente el arquetipo correspondiente.
 */
export function calculateVoiceArchetype(answers: Record<string, string>): VoiceArchetype {
  const objective = answers.objective || "";
  const profession = answers.profession || "";
  const fearSymptom = answers.fearSymptom || "";
  const scenario = answers.highStakesScenario || "";
  const pace = answers.speakingPace || "";
  const vocalTone = answers.vocalTone || "";
  const archetypeChoice = answers.archetypeVector || "";

  // Pesos dimensionales acumulados
  let scoreLeadership = 0;
  let scoreStrategy = 0;
  let scoreClarity = 0;
  let scoreOratory = 0;
  let scoreRegulation = 0;
  let scoreSales = 0;

  // 1. Evaluación por Objetivo Primario
  if (objective === "liderazgo") scoreLeadership += 35;
  else if (objective === "ventas") scoreSales += 35;
  else if (objective === "confianza") scoreOratory += 30;
  else if (objective === "claridad") scoreClarity += 35;

  // 2. Evaluación por Profesión
  if (profession === "direccion") scoreLeadership += 25;
  else if (profession === "comercial") scoreSales += 25;
  else if (profession === "consultoria") scoreClarity += 20;
  else if (profession === "creador") scoreOratory += 25;

  // 3. Evaluación por Síntoma Físico (Neuro-Vocal)
  if (fearSymptom === "temblor" || fearSymptom === "nudo_garganta") {
    scoreRegulation += 35; // Necesidad prioritaria de anclaje neuromuscular
  } else if (fearSymptom === "aceleracion") {
    scoreStrategy += 20;
    scoreRegulation += 15;
  } else if (fearSymptom === "mente_blanco") {
    scoreClarity += 20;
  }

  // 4. Evaluación por Escenario de Alto Impacto
  if (scenario === "juntas_directivas") {
    scoreLeadership += 20;
    scoreStrategy += 15;
  } else if (scenario === "negociacion_1a1") {
    scoreSales += 25;
  } else if (scenario === "auditorios_eventos") {
    scoreOratory += 25;
  } else if (scenario === "videos_camaras") {
    scoreClarity += 15;
    scoreOratory += 15;
  }

  // 5. Evaluación por Tono y Timbre
  if (vocalTone === "aspiracion_grave" || vocalTone === "aceptable_sin_peso") {
    scoreLeadership += 15;
  } else if (vocalTone === "aguda_tensa" || vocalTone === "debil_apagada") {
    scoreRegulation += 15;
  }

  // 6. Inclinación explícita del vector aspiracional (si se seleccionó)
  if (archetypeChoice === "lider_magnetico") scoreLeadership += 30;
  else if (archetypeChoice === "persuasor_estrategico") scoreSales += 30;
  else if (archetypeChoice === "comunicador_cristalino") scoreClarity += 30;
  else if (archetypeChoice === "orador_apasionado") scoreOratory += 30;

  // Decisión del Arquetipo Ganador
  // Regla prioritaria: Si la tensión o síntoma de temblor es muy alto, el ancla neuro-vocal toma precedencia
  if (scoreRegulation >= 50 && (fearSymptom === "temblor" || fearSymptom === "nudo_garganta")) {
    return VOICE_ARCHETYPES.ANCLA_NEUROVOCAL;
  }

  // Si lidera ventas y negociación
  if (scoreSales >= scoreLeadership && scoreSales >= scoreClarity && scoreSales >= scoreOratory) {
    return VOICE_ARCHETYPES.PERSUASOR_ALTO_CIERRE;
  }

  // Si lidera liderazgo y dirección
  if (scoreLeadership >= scoreClarity && scoreLeadership >= scoreOratory) {
    if (scenario === "juntas_directivas" || profession === "direccion") {
      return VOICE_ARCHETYPES.COMANDANTE_ESTRATEGICO;
    }
    return VOICE_ARCHETYPES.LIDER_MAGNETICO;
  }

  // Si lidera claridad o consultoría técnica
  if (scoreClarity >= scoreOratory) {
    if (profession === "consultoria" || objective === "claridad") {
      return VOICE_ARCHETYPES.AUTORIDAD_ANALITICA;
    }
    return VOICE_ARCHETYPES.COMUNICADOR_CRISTALINO;
  }

  // Si lidera oratoria y creador de contenido
  if (scoreOratory > 40) {
    return VOICE_ARCHETYPES.ORADOR_VISIONARIO;
  }

  // Default equilibrado
  return VOICE_ARCHETYPES.LIDER_MAGNETICO;
}

/**
 * Cálculo de Distancia Bioacústica Real
 * Mide la distancia euclidiana porcentual entre las métricas reales de 15s y el arquetipo.
 */
export function calculateAcousticDistance(
  archetype: VoiceArchetype,
  measuredMetrics: {
    wordsPerMinute: number;
    avgPauseDuration: number;
    pitchVariation: number | null;
    energyStability: number | null;
    fillerCount?: number;
  }
): {
  distancePercent: number;          // 0% a 100% (distancia o brecha a cerrar)
  matchScore: number;              // 0 a 100 (afinidad actual)
  wpmDelta: number;
  pauseDelta: number;
  pitchDelta: number;
  energyDelta: number;
  bottleneckDimension: string;
} {
  const target = archetype.acousticVector;

  // 1. Delta WPM
  const midWpm = (target.wpmRange[0] + target.wpmRange[1]) / 2;
  const wpmDelta = Math.abs(measuredMetrics.wordsPerMinute - midWpm);
  const wpmScore = Math.max(0, 100 - (wpmDelta / 35) * 100);

  // 2. Delta Pausas
  const pauseDelta = Math.abs(measuredMetrics.avgPauseDuration - target.pauseDurationSec);
  const pauseScore = Math.max(0, 100 - (pauseDelta / 0.8) * 100);

  // 3. Delta Pitch / Modulación
  const pitchVar = measuredMetrics.pitchVariation ?? target.pitchVariationHz * 0.7;
  const pitchDelta = Math.abs(pitchVar - target.pitchVariationHz);
  const pitchScore = Math.max(0, 100 - (pitchDelta / 30) * 100);

  // 4. Delta Estabilidad RMS
  const energyStab = measuredMetrics.energyStability ?? 0.7;
  const energyDelta = Math.max(0, target.energyStability - energyStab);
  const energyScore = Math.max(0, 100 - energyDelta * 200);

  // Afinidad promedio ponderada
  const matchScore = Math.round(
    wpmScore * 0.3 + pauseScore * 0.3 + pitchScore * 0.2 + energyScore * 0.2
  );

  const distancePercent = Math.max(5, 100 - matchScore);

  // Detección del cuello de botella más distante
  const scores = [
    { dim: "Ritmo y Tempo (WPM)", score: wpmScore },
    { dim: "Duración de Pausas", score: pauseScore },
    { dim: "Modulación Tonal (Pitch)", score: pitchScore },
    { dim: "Estabilidad de Energía (RMS)", score: energyScore },
  ];
  scores.sort((a, b) => a.score - b.score);

  return {
    distancePercent,
    matchScore,
    wpmDelta: Math.round(wpmDelta),
    pauseDelta: Math.round(pauseDelta * 100) / 100,
    pitchDelta: Math.round(pitchDelta),
    energyDelta: Math.round(energyDelta * 100) / 100,
    bottleneckDimension: scores[0].dim,
  };
}
