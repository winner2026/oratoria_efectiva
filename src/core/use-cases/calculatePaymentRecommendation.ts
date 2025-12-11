/**
 * CASO DE USO #2: Calcular recomendación de pago
 *
 * Motor que transforma un cálculo en una acción concreta.
 * Aquí nace el valor psicológico y financiero del producto.
 *
 * Este motor convierte cálculos fríos en recomendaciones que:
 * - Activan el flywheel
 * - Impulsan la retención
 * - Crean dependencia emocional
 * - Preparan el camino a monetización
 * - Hacen que la app aporte valor cada mes
 */

/**
 * INPUT: Datos del cálculo de deuda actual (Caso de Uso #1)
 */
export interface CalculatePaymentRecommendationInput {
  realDebt: number              // Del caso de uso 1
  minimumPayment: number        // Del caso de uso 1
  noInterestPayment: number     // Del caso de uso 1
  interestIfMinPayment: number  // Del caso de uso 1
  daysRemaining: number         // Del caso de uso 1
}

/**
 * OUTPUT: Recomendación de pago óptima
 */
export interface CalculatePaymentRecommendationOutput {
  recommendedPayment: number              // El pago óptimo para evitar intereses
  savingsIfRecommended: number            // Cuánto se ahorra vs pagar mínimo
  recommendedMessage: string              // Texto listo para UI
  urgencyLevel: 'low' | 'medium' | 'high' // Para destacar visualmente
}

/**
 * Calcular la recomendación de pago óptima
 *
 * Este caso de uso es VITAL para el negocio porque convierte
 * un cálculo frío en una acción concreta, activando el flywheel.
 */
export function calculatePaymentRecommendation(
  input: CalculatePaymentRecommendationInput
): CalculatePaymentRecommendationOutput {
  // ✔ Recomendación principal
  const recommendedPayment = input.noInterestPayment

  // ✔ Ahorro esperado
  const savingsIfRecommended = input.interestIfMinPayment

  // ✔ Mensaje personalizado
  const recommendedMessage = `Paga $${recommendedPayment.toFixed(
    2
  )} hoy para evitar $${savingsIfRecommended.toFixed(2)} en intereses.`

  // ✔ Urgencia basada en días restantes
  let urgencyLevel: 'low' | 'medium' | 'high' = 'low'
  if (input.daysRemaining <= 3) {
    urgencyLevel = 'high'
  } else if (input.daysRemaining <= 10) {
    urgencyLevel = 'medium'
  }

  // ✔ Resultado completo
  return {
    recommendedPayment,
    savingsIfRecommended,
    recommendedMessage,
    urgencyLevel
  }
}
