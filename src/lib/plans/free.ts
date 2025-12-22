import { Plan } from "@/types/Plan";

/**
 * Free Plan Definition - MVP
 *
 * REGLA DURA:
 * - 3 análisis TOTAL por usuario (no por día, no por semana, TOTAL)
 * - No historial
 * - No re-grabar
 * - No ejercicios
 * - No comparaciones
 *
 * Objetivo:
 * - Permitir probar el producto adecuadamente (antes/después/confirmación)
 * - Evitar abusos
 * - Costo mínimo: ~$0.018 por usuario (~3 análisis × $0.006)
 * - Aumentar conversión a Premium
 */
export const FREE_PLAN: Plan = {
  type: "FREE",
  features: {
    maxAnalyses: 3, // TOTAL, no por período
    hasHistory: false,
    hasReRecord: false,
    hasExercises: false,
  },
};
