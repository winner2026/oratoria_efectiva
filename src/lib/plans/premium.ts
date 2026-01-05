import { Plan } from "@/types/Plan";

/**
 * Premium Plan Definition
 *
 * - Unlimited analyses
 * - Full history access
 * - Re-record capability
 * - Access to exercises
 */
export const PREMIUM_PLAN: Plan = {
  type: "PREMIUM",
  features: {
    maxAnalyses: -1, // -1 = unlimited
    maxAnalysesPerWeek: -1,
    maxAnalysesPerMonth: 100, // Política de Uso Justo (Rentabilidad)
    hasHistory: true,
    hasHistoryLimit: -1,
    hasReRecord: true,
    hasExercises: true,
    hasExercisesLimit: -1,
    hasFullGym: true,
    hasCourses: true,
  },
};
