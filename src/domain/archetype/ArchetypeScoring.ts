/**
 * Motor de Puntuación Bioacústica Diferencial con Máximos Asimétricos
 * 
 * Máximos específicos calibrados que suman exactamente 100 puntos:
 * - Consistencia Vocal:          Máximo 20 pts
 * - Claridad & Articulación:     Máximo 17 pts
 * - Ritmo & Capacidad de Pausa:  Máximo 25 pts
 * - Peso & Tono de Autoridad:    Máximo 20 pts
 * - Regulación Neuro-Vocal:      Máximo 18 pts
 * TOTAL: 20 + 17 + 25 + 20 + 18 = 100 pts
 */

export interface DimensionItem {
  currentVal: number;
  max: number;
  percent: number;
  grade: string;
  ratioText: string;
}

export interface DimensionScoreResult {
  consistency: DimensionItem;
  clarity: DimensionItem;
  rhythm: DimensionItem;
  authority: DimensionItem;
  regulation: DimensionItem;
  totalScore: number;
  overallGrade: string;
}

export function calculateDynamicDimensions(answers: Record<string, string>): DimensionScoreResult {
  const answeredCount = Object.keys(answers).length;
  if (answeredCount === 0) {
    return {
      consistency: { currentVal: 0, max: 20, percent: 0, grade: "-", ratioText: "0/20" },
      clarity: { currentVal: 0, max: 17, percent: 0, grade: "-", ratioText: "0/17" },
      rhythm: { currentVal: 0, max: 25, percent: 0, grade: "-", ratioText: "0/25" },
      authority: { currentVal: 0, max: 20, percent: 0, grade: "-", ratioText: "0/20" },
      regulation: { currentVal: 0, max: 18, percent: 0, grade: "-", ratioText: "0/18" },
      totalScore: 0,
      overallGrade: "-"
    };
  }

  // Puntuaciones base asimétricas
  let consistencyScore = 14; // sobre 20
  let clarityScore = 12;     // sobre 17
  let rhythmScore = 17;      // sobre 25
  let authorityScore = 13;   // sobre 20
  let regulationScore = 12;  // sobre 18

  // 1. Meta / Objetivo
  if (answers.objective === "liderazgo") {
    authorityScore += 4;
    rhythmScore += 2;
  } else if (answers.objective === "claridad") {
    clarityScore += 3;
    consistencyScore += 2;
  } else if (answers.objective === "confianza") {
    regulationScore += 3;
  } else if (answers.objective === "ventas") {
    authorityScore += 3;
    clarityScore += 2;
  }

  // 2. Profesión / Rol
  if (answers.profession === "direccion") {
    authorityScore += 3;
  } else if (answers.profession === "consultoria") {
    clarityScore += 2;
  } else if (answers.profession === "creador") {
    rhythmScore += 3;
  }

  // 3. Síntoma de miedo (Impacto directo severo en Regulación y Consistencia)
  if (answers.fearSymptom === "temblor") {
    regulationScore -= 7; // Dificultad severa: temblor neuro-vocal -> Nota D o C
    consistencyScore -= 5;
  } else if (answers.fearSymptom === "mente_blanco") {
    regulationScore -= 5;
    clarityScore -= 5;
  } else if (answers.fearSymptom === "nudo_garganta") {
    regulationScore -= 5;
    authorityScore -= 4;
  } else if (answers.fearSymptom === "aceleracion") {
    rhythmScore -= 9;     // Dificultad severa en ritmo -> Nota D
    regulationScore -= 4;
  }

  // 4. Velocidad de habla (Speaking Pace)
  if (answers.speakingPace === "demasiado_rapido") {
    rhythmScore -= 10;    // Caída en ritmo: palabras atropelladas
    clarityScore -= 3;
  } else if (answers.speakingPace === "monotono_plano") {
    authorityScore -= 4;
    rhythmScore -= 5;
  } else if (answers.speakingPace === "pausas_incomodas") {
    rhythmScore -= 7;
    regulationScore -= 3;
  } else if (answers.speakingPace === "variable_ansioso") {
    rhythmScore -= 5;
    regulationScore -= 4;
  }

  // 5. Muletillas (Filler words)
  if (answers.fillerWords === "muy_frecuente") {
    clarityScore -= 7;    // Caída en claridad: muletillas continuas
    consistencyScore -= 4;
  } else if (answers.fillerWords === "ante_preguntas") {
    clarityScore -= 3;
    regulationScore -= 3;
  } else if (answers.fillerWords === "ocasional_rigido") {
    clarityScore += 1;
    regulationScore -= 2;
  } else if (answers.fillerWords === "quiero_pulir") {
    clarityScore += 3;
  }

  // 6. Improvisación (Impromptu ability)
  if (answers.impromptuAbility === "bloqueo_total") {
    regulationScore -= 5;
    authorityScore -= 4;
  } else if (answers.impromptuAbility === "rodeos_largos") {
    clarityScore -= 4;
    rhythmScore -= 4;
  } else if (answers.impromptuAbility === "correcto_sin_brillo") {
    authorityScore -= 3;
  } else if (answers.impromptuAbility === "falta_precision") {
    clarityScore -= 3;
  }

  // 7. Timbre y proyección (Vocal tone)
  if (answers.vocalTone === "debil_apagada") {
    authorityScore -= 7;  // Caída en autoridad: voz apagada que no se escucha
    consistencyScore -= 4;
  } else if (answers.vocalTone === "aguda_tensa") {
    authorityScore -= 4;
    regulationScore -= 4;
  } else if (answers.vocalTone === "aceptable_sin_peso") {
    authorityScore += 1;
  } else if (answers.vocalTone === "aspiracion_grave") {
    authorityScore += 4;
    consistencyScore += 2;
  }

  // Factor de escala según avance
  const progressFactor = Math.min(1, Math.max(0.45, answeredCount / 9));

  // Clampeo a rangos válidos con sus máximos específicos
  const finalConsistency = Math.max(2, Math.min(20, Math.round(consistencyScore * progressFactor)));
  const finalClarity = Math.max(2, Math.min(17, Math.round(clarityScore * progressFactor)));
  const finalRhythm = Math.max(3, Math.min(25, Math.round(rhythmScore * progressFactor)));
  const finalAuthority = Math.max(2, Math.min(20, Math.round(authorityScore * progressFactor)));
  const finalRegulation = Math.max(2, Math.min(18, Math.round(regulationScore * progressFactor)));

  const p1 = Math.round((finalConsistency / 20) * 100);
  const p2 = Math.round((finalClarity / 17) * 100);
  const p3 = Math.round((finalRhythm / 25) * 100);
  const p4 = Math.round((finalAuthority / 20) * 100);
  const p5 = Math.round((finalRegulation / 18) * 100);

  const getGrade = (pct: number) => {
    if (pct >= 88) return "A+";
    if (pct >= 76) return "A";
    if (pct >= 64) return "B";
    if (pct >= 50) return "C";
    return "D";
  };

  const totalScore = finalConsistency + finalClarity + finalRhythm + finalAuthority + finalRegulation;
  const overallGrade = getGrade(totalScore);

  return {
    consistency: { currentVal: finalConsistency, max: 20, percent: p1, grade: getGrade(p1), ratioText: `${finalConsistency}/20` },
    clarity: { currentVal: finalClarity, max: 17, percent: p2, grade: getGrade(p2), ratioText: `${finalClarity}/17` },
    rhythm: { currentVal: finalRhythm, max: 25, percent: p3, grade: getGrade(p3), ratioText: `${finalRhythm}/25` },
    authority: { currentVal: finalAuthority, max: 20, percent: p4, grade: getGrade(p4), ratioText: `${finalAuthority}/20` },
    regulation: { currentVal: finalRegulation, max: 18, percent: p5, grade: getGrade(p5), ratioText: `${finalRegulation}/18` },
    totalScore,
    overallGrade
  };
}

export function getArchetypeAvatarUrl(archetypeId?: string, isCompleted: boolean = false): string {
  if (!archetypeId || !isCompleted) {
    return "/avatars/generic-trainee.svg";
  }

  const map: Record<string, string> = {
    LIDER_MAGNETICO: "/avatars/lider-magnetico.svg",
    COMANDANTE_ESTRATEGICO: "/avatars/comandante-estrategico.svg",
    PERSUASOR_ALTO_CIERRE: "/avatars/persuasor-alto-cierre.svg",
    COMUNICADOR_CRISTALINO: "/avatars/comunicador-cristalino.svg",
    AUTORIDAD_ANALITICA: "/avatars/autoridad-analitica.svg",
    ORADOR_VISIONARIO: "/avatars/orador-visionario.svg",
    ANCLA_NEUROVOCAL: "/avatars/ancla-neurovocal.svg",
    RESONADOR_EMPATICO: "/avatars/resonador-empatico.svg"
  };

  return map[archetypeId] || "/avatars/generic-trainee.svg";
}
