import { Plan } from "@/types/Plan";

/**
 * Free Plan Definition - v2.0
 *
 * REGLA: 3 análisis POR SEMANA (se resetea cada lunes)
 * 
 * Beneficios:
 * - Suficiente para crear hábito
 * - Suficiente fricción para querer Premium
 * - Costo controlado: ~$0.06/usuario/mes
 * 
 * Premium desbloquea:
 * - Análisis ilimitados
 * - Historial completo
 * - Gimnasio completo
 * - Cursos
 */
export const FREE_PLAN: Plan = {
  type: "FREE",
  features: {
    maxAnalysesPerWeek: 3, // Por semana, no total
    maxAnalysesPerMonth: -1,
    maxAnalyses: 3, // Compatibilidad con código existente
    hasHistory: true, // Ahora sí tienen historial limitado
    hasHistoryLimit: 3, // Solo últimas 3 sesiones
    hasReRecord: false,
    hasExercises: true, // Algunos ejercicios
    hasExercisesLimit: 5, // Solo 5 ejercicios
    hasFullGym: false,
    hasCourses: false,
  },
};

/**
 * Premium Plan Definition
 */
export const PREMIUM_PLAN: Plan = {
  type: "PREMIUM",
  features: {
    maxAnalysesPerWeek: -1, // Ilimitado
    maxAnalysesPerMonth: 100, // Límite de rentabilidad
    maxAnalyses: -1,
    hasHistory: true,
    hasHistoryLimit: -1, // Sin límite
    hasReRecord: true,
    hasExercises: true,
    hasExercisesLimit: -1,
    hasFullGym: true,
    hasCourses: true,
  },
};
