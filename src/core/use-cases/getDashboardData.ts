import { Transaction } from '../entities/Transaction'
import { ICreditCardRepository } from '../repositories/ICreditCardRepository'
import { ITransactionRepository } from '../repositories/ITransactionRepository'
import {
  CalculateCurrentDebtOutput,
  CalculateCurrentDebtInput,
  calculateCurrentDebt
} from './calculateCurrentDebt'
import {
  CalculatePaymentRecommendationOutput,
  CalculatePaymentRecommendationInput,
  calculatePaymentRecommendation
} from './calculatePaymentRecommendation'
import {
  CalculateProjectionOutput,
  CalculateProjectionInput,
  calculateProjection
} from './calculateProjection'

/**
 * CASO DE USO #5: Obtener datos del dashboard
 *
 * Use Case Orquestador - El compositor del dominio.
 * Consolida TODO lo necesario para "La Verdad de tu Tarjeta"
 *
 * NO calcula nada por sí mismo.
 * Solo coordina los otros 3 motores y obtiene datos de repositorios.
 */

/**
 * INPUT: Datos mínimos para obtener el dashboard
 */
export interface GetDashboardDataInput {
  creditCardId: string    // Identifica la tarjeta del usuario
  today?: Date            // Para test o simulación
}

/**
 * OUTPUT: Todos los datos necesarios para renderizar el dashboard
 */
export interface GetDashboardDataOutput {
  currentDebt: CalculateCurrentDebtOutput
  recommendation: CalculatePaymentRecommendationOutput
  defaultProjection: CalculateProjectionOutput
  recentTransactions: Transaction[]
}

/**
 * Dependencias del caso de uso (inyectadas explícitamente)
 */
export interface GetDashboardDataDependencies {
  creditCardRepo: ICreditCardRepository
  transactionRepo: ITransactionRepository
}

/**
 * Obtener datos consolidados del dashboard
 *
 * Orquesta los 3 motores de cálculo y repositorios
 * para entregar TODO en una sola llamada.
 */
export async function getDashboardData(
  input: GetDashboardDataInput,
  deps: GetDashboardDataDependencies
): Promise<GetDashboardDataOutput> {
  const today = input.today ?? new Date()

  // 1. Obtener tarjeta desde repositorio
  const creditCard = await deps.creditCardRepo.getById(input.creditCardId)

  // 2. Obtener transacciones desde repositorio
  const allTransactions = await deps.transactionRepo.getByCreditCardId(
    input.creditCardId
  )

  // 3. Calcular deuda actual (Motor #1)
  const currentDebtInput: CalculateCurrentDebtInput = {
    balance: creditCard.balance,
    statementDate: creditCard.statementDate,
    dueDate: creditCard.dueDate,
    today
  }

  const currentDebt = await calculateCurrentDebt(currentDebtInput)

  // 4. Calcular recomendación de pago (Motor #2)
  const recommendationInput: CalculatePaymentRecommendationInput = {
    realDebt: currentDebt.realDebt,
    minimumPayment: currentDebt.minimumPayment,
    noInterestPayment: currentDebt.noInterestPayment,
    interestIfMinPayment: currentDebt.interestIfMinPayment,
    daysRemaining: currentDebt.daysRemaining
  }

  const recommendation = calculatePaymentRecommendation(recommendationInput)

  // 5. Calcular proyección por defecto (Motor #3)
  // paymentAmount = 0 significa "sin pago"
  const projectionInput: CalculateProjectionInput = {
    realDebt: currentDebt.realDebt,
    paymentAmount: 0,
    interestRateMonthly: creditCard.interestRateMonthly
  }

  const defaultProjection = calculateProjection(projectionInput)

  // 6. Filtrar transacciones recientes (últimas 10)
  const recentTransactions = allTransactions.slice(0, 10)

  // 7. Retornar todo consolidado
  return {
    currentDebt,
    recommendation,
    defaultProjection,
    recentTransactions
  }
}
