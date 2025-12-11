import { Transaction } from '../entities/Transaction'
import { MSIPlan } from '../entities/MSIPlan'
import { ValidationError, BusinessRuleError } from '../errors'

/**
 * CASO DE USO #4: Agregar transacción
 *
 * Registrar una compra nueva (normal o MSI).
 * Solo crea la entidad, valida reglas y regresa un objeto listo para persistir.
 *
 * Crítico para:
 * - Activar el flywheel (más datos → mejor precisión → más valor)
 * - Construir features premium (impacto mensual, over-spending alerts)
 * - MSI optimizado
 * - Monetización real con proyecciones avanzadas
 */

/**
 * INPUT: Datos para registrar una nueva transacción
 */
export interface AddTransactionInput {
  amount: number          // Monto de la compra
  date: Date              // Fecha de la compra
  description?: string    // Opcional
  isMSI?: boolean         // ¿Es compra MSI?
  msiMonths?: number      // Si es MSI → número de meses
}

/**
 * OUTPUT: Entidades listas para persistir
 */
export interface AddTransactionOutput {
  transaction: Transaction  // Entidad lista para guardar
  msiPlan?: MSIPlan         // Si aplica, el plan MSI generado
  message: string           // Texto para UI
}

/**
 * Agregar una nueva transacción (compra normal o MSI)
 *
 * Reglas de negocio (V1 MVP):
 *
 * 1. Validaciones:
 *    - amount > 0
 *    - msiMonths > 1 si isMSI === true
 *
 * 2. Construcción de la entidad Transaction:
 *    transaction = new Transaction({
 *      amount,
 *      date,
 *      description,
 *      type: isMSI ? "MSI" : "NORMAL"
 *    })
 *
 * 3. Si es MSI → construir el plan:
 *    monthlyPayment = amount / msiMonths
 *    remainingMonths = msiMonths
 *    startMonth = date
 *
 *    msiPlan = new MSIPlan({
 *      totalAmount: amount,
 *      months: msiMonths,
 *      monthlyPayment,
 *      startDate: date
 *    })
 *
 * 4. Mensaje claro para el usuario:
 *    - Compra normal: "Compra registrada: $350 en Starbucks."
 *    - MSI: "Compra a MSI registrada: $4,800 a 12 meses ($400 por mes)."
 *
 * Errores:
 * - ValidationError si amount <= 0
 * - BusinessRuleError si isMSI === true pero msiMonths < 2
 */
export function addTransaction(
  input: AddTransactionInput
): AddTransactionOutput {
  // TODO: implementar reglas

  throw new Error('Not implemented yet')
}
