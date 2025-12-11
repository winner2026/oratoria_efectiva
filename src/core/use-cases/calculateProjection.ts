import { Transaction } from '../entities/Transaction'
import { MSIPlan } from '../entities/MSIPlan'

/**
 * CASO DE USO #3: Calcular proyección de deuda
 *
 * Motor de simulación de pagos y proyección mensual.
 * Permite al usuario entender qué pasará si toma una acción hoy.
 *
 * Este motor genera control emocional (Norman):
 * El usuario ve el futuro → siente que controla → regresa mensualmente
 *
 * Crítico para:
 * - Pantalla de Proyecciones
 * - Mensajes predictivos ("Si pagas $X, tu deuda será $Y")
 * - Monetización futura (proyección premium)
 * - Simular MSI
 * - Optimizar pagos
 */

/**
 * INPUT: Datos para simular proyección de pago
 */
export interface CalculateProjectionInput {
  realDebt: number                  // Deuda actual
  paymentAmount: number             // Pago que el usuario quiere simular
  interestRateMonthly: number       // Tasa mensual (ej: 0.07 = 7%)
  transactions?: Transaction[]      // Opcional en MVP
  msiPlans?: MSIPlan[]              // Planes de MSI activos
}

/**
 * OUTPUT: Resultado de la proyección
 */
export interface CalculateProjectionOutput {
  projectedDebtNextMonth: number    // Deuda después del pago + intereses
  interestCharged: number           // Intereses generados
  msiMonthlyTotal: number           // Cuotas MSI que se suman el próximo mes
  message: string                   // Texto listo para UI
}

/**
 * Calcular proyección de deuda para el próximo mes
 *
 * Motor usado para:
 * - Proyección por defecto (paymentAmount = 0)
 * - Simulaciones en V2
 * - Insights premium en V3
 */
export function calculateProjection(
  input: CalculateProjectionInput
): CalculateProjectionOutput {
  // 1. Aplicar pago simulado
  let remaining = input.realDebt - input.paymentAmount
  if (remaining < 0) remaining = 0

  // 2. Intereses del mes
  const interestCharged = remaining * input.interestRateMonthly

  // 3. MSI (MVP simplificado - suma de cuotas mensuales)
  const msiMonthlyTotal =
    input.msiPlans?.reduce((sum, p) => sum + p.monthlyPayment, 0) ?? 0

  // 4. Proyección final
  const projectedDebtNextMonth = remaining + interestCharged + msiMonthlyTotal

  // 5. Mensaje personalizado
  const message = `Pagando $${input.paymentAmount.toFixed(
    2
  )}, tu deuda del próximo mes será $${projectedDebtNextMonth.toFixed(2)}.`

  return {
    projectedDebtNextMonth,
    interestCharged,
    msiMonthlyTotal,
    message
  }
}
