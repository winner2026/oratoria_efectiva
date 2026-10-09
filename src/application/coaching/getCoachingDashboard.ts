import { CoachingRepository } from '@/infrastructure/db/repositories/coachingRepository';
import { WeaknessType } from '@/domain/coaching/Weakness';

export interface CoachingDashboardViewModel {
  authorityIndex: number;
  scoreDelta: number;
  currentFocus: {
    type: WeaknessType | 'MAINTENANCE';
    title: string;
    severity: number;
    explanation: string;
  };
  todayMission: {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    level: number;
    customRoute: string;
  };
  progress: {
    currentDay: number;
    totalDays: 21;
    history: Array<{
      date: string;
      score: number;
    }>;
  };
  nextGoal?: {
    type: WeaknessType;
    title: string;
    progressPercentage: number;
  };
}

export async function getCoachingDashboard(userId: string): Promise<CoachingDashboardViewModel> {
  const userState = await CoachingRepository.getUserCoachingState(userId);
  const sessionHistory = await CoachingRepository.getUserSessionHistory(userId);

  // 1. Calcular delta de puntaje respecto a la sesión anterior
  const previousScore = sessionHistory.length > 1
    ? sessionHistory[sessionHistory.length - 2].currentScore
    : userState.authorityScore;
  const scoreDelta = userState.authorityScore - previousScore;

  // 2. Foco Actual (Formateado en lenguaje positivo / no juzgador)
  const activeWeakness = userState.lastDiagnostic?.primaryWeakness;
  const currentFocus = {
    type: (activeWeakness ? activeWeakness.type : 'MAINTENANCE') as WeaknessType | 'MAINTENANCE',
    title: activeWeakness ? activeWeakness.label : 'Mantenimiento de Autoridad',
    severity: activeWeakness ? activeWeakness.severity : 0,
    explanation: userState.lastDiagnostic?.behavioralSummary || 'Tu voz demuestra excelente estabilidad y proyección.',
  };

  // 3. Misión Recomendada para Hoy (Prescrita por el Motor Adaptativo)
  const rx = userState.activePrescription;
  const todayMission = {
    id: rx ? rx.targetExerciseId : 'authority-pause',
    title: rx ? rx.exerciseTitle : 'Misión: Pausa de Autoridad',
    description: rx ? rx.rationale : 'Practica el uso estratégico del silencio antes de una idea importante.',
    durationMinutes: rx ? rx.recommendedDurationMinutes : 3,
    level: Math.min(5, Math.max(1, Math.ceil(userState.curriculumDay / 4))), // Nivel adaptativo 1 a 5
    customRoute: rx ? rx.customRoute : '/practice/pause',
  };

  // 4. Historial de Evolución para el Gráfico
  const history = userState.scoreHistory.map((h, i) => ({
    date: `Día ${i + 1}`,
    score: h.score,
  }));

  // 5. Próximo Objetivo (Siguiente cuello de botella en cola)
  const secondaryWeakness = userState.lastDiagnostic?.secondaryWeaknesses?.[0];
  const nextGoal = secondaryWeakness
    ? {
        type: secondaryWeakness.type,
        title: secondaryWeakness.label,
        progressPercentage: Math.round((1 - secondaryWeakness.severity) * 100),
      }
    : undefined;

  return {
    authorityIndex: userState.authorityScore,
    scoreDelta,
    currentFocus,
    todayMission,
    progress: {
      currentDay: userState.curriculumDay,
      totalDays: 21,
      history,
    },
    nextGoal,
  };
}
