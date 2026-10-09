export type ProgressEvaluation = {
  previousScore: number;
  newScore: number;
  scoreDelta: number; // e.g. +2
  status: 'IMPROVED' | 'STABLE' | 'REGRESSED';
  feedbackSummary: string;
  focusMilestoneAchieved: boolean;
};

export function evaluateProgress(
  previousState: { authorityScore: number; currentFocus?: string },
  newScore: { score: number; primaryWeaknessType?: string }
): ProgressEvaluation {
  const previousScore = previousState.authorityScore;
  const newScoreValue = newScore.score;
  const scoreDelta = newScoreValue - previousScore;

  let status: 'IMPROVED' | 'STABLE' | 'REGRESSED' = 'STABLE';
  if (scoreDelta > 1) {
    status = 'IMPROVED';
  } else if (scoreDelta < -1) {
    status = 'REGRESSED';
  }

  // Verificar si la debilidad que era foco ya no es la debilidad principal
  const focusMilestoneAchieved =
    Boolean(previousState.currentFocus) &&
    newScore.primaryWeaknessType !== previousState.currentFocus;

  let feedbackSummary = '';
  if (status === 'IMPROVED') {
    feedbackSummary = `¡Excelente! Tu puntaje de autoridad aumentó +${scoreDelta} puntos (de ${previousScore} a ${newScoreValue}).`;
  } else if (status === 'REGRESSED') {
    feedbackSummary = `Tu puntaje cedió ${scoreDelta} puntos (de ${previousScore} a ${newScoreValue}). Necesitamos reforzar el soporte físico.`;
  } else {
    feedbackSummary = `Tu puntaje se mantiene estable en ${newScoreValue}. Ajustemos la intensidad de los ejercicios.`;
  }

  if (focusMilestoneAchieved) {
    feedbackSummary += ` 🎯 ¡Hito alcanzado! Has reducido el impacto negativo de ${previousState.currentFocus}.`;
  }

  return {
    previousScore,
    newScore: newScoreValue,
    scoreDelta,
    status,
    feedbackSummary,
    focusMilestoneAchieved,
  };
}
