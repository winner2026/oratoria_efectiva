import { Transaction, TransactionType } from '../entities/Transaction'
import { MSIPlan } from '../entities/MSIPlan'
import { ValidationError, BusinessRuleError } from '../errors'

/**
 * INPUT: Datos necesarios para calcular la deuda actual
 */
export interface CalculateCurrentDebtInput {
  balance: number              // Saldo actual reportado por el usuario
  statementDate: Date          // Fecha de corte
  dueDate: Date                // Fecha límite de pago
  today?: Date                 // Por defecto = new Date()
  transactions?: Transaction[] // Opcional en MVP
  msiPlans?: MSIPlan[]         // Planes MSI activos (opcional)
}

/**
 * OUTPUT: Resultado completo del cálculo de deuda
 */
export interface CalculateCurrentDebtOutput {
  realDebt: number                    // Deuda exacta al día de hoy
  minimumPayment: number              // Pago mínimo estimado
  noInterestPayment: number           // Pago para no generar intereses
  interestIfMinPayment: number        // Intereses proyectados si solo paga el mínimo
  daysRemaining: number               // Días antes de la fecha límite
  isBeforeStatement: boolean          // ¿Está antes del corte?
  nextStatementDate: Date             // Fecha del próximo corte
  cycleStatus: 'before_cutoff' | 'after_cutoff'
}

/**
 * CASO DE USO #1: Calcular deuda actual
 *
 * Motor base que alimenta:
 * - DebtSummary
 * - Recomendaciones
 * - Proyecciones
 * - Alertas internas
 * - Experiencia emocional ("entiendo mi tarjeta")
 */
export async function calculateCurrentDebt(
  input: CalculateCurrentDebtInput
): Promise<CalculateCurrentDebtOutput> {
  // Validaciones
  validateInput(input)

  // ✅ 1. Obtener valores iniciales
  const today = input.today ?? new Date()
  const balance = input.balance
  const statementDate = new Date(input.statementDate)
  const dueDate = new Date(input.dueDate)

  // ✅ 2. Días restantes
  const daysRemaining = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  // ✅ 3. Estado del ciclo
  const isBeforeStatement = today < statementDate

  // ✅ 4. Real Debt (v1 simple - no depende de transacciones ni MSI todavía)
  const realDebt = balance

  // ✅ 5. Mínimo a pagar - regla mexicana simplificada
  const minimumPayment = Math.max(realDebt * 0.04, 200)

  // ✅ 6. Pago sin intereses
  const noInterestPayment = realDebt

  // ✅ 7. Intereses si paga mínimo
  const dailyRate = 0.07 / 30  // 7% mensual aproximado
  const interestIfMinPayment =
    (realDebt - minimumPayment) * dailyRate * daysRemaining

  // ✅ 8. Próxima fecha de corte
  const nextStatementDate = new Date(statementDate)
  nextStatementDate.setMonth(nextStatementDate.getMonth() + 1)

  // ✅ 9. Cycle status
  const cycleStatus: 'before_cutoff' | 'after_cutoff' =
    isBeforeStatement ? 'before_cutoff' : 'after_cutoff'

  // ✅ OUTPUT COMPLETO
  return {
    realDebt,
    minimumPayment,
    noInterestPayment,
    interestIfMinPayment,
    daysRemaining,
    isBeforeStatement,
    nextStatementDate,
    cycleStatus
  }
}

/**
 * VALIDACIONES DE ENTRADA
 */
function validateInput(input: CalculateCurrentDebtInput): void {
  if (input.balance < 0) {
    throw new ValidationError(
      'El saldo no puede ser negativo',
      'balance',
      ['Balance debe ser mayor o igual a 0']
    )
  }

  if (input.dueDate <= input.statementDate) {
    throw new BusinessRuleError(
      'La fecha de pago debe ser posterior a la fecha de corte',
      'INVALID_DATE_RANGE'
    )
  }
}
