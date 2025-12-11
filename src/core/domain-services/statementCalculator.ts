import { CreditCard } from '../entities/CreditCard'
import { PaymentProjection } from '../entities/Projection'
import { calculateInterestForMonth } from './interestCalculator'

export interface ProjectionResult {
  months: number
  totalInterest: number
  totalPaid: number
  projections: PaymentProjection[]
}

export function calculateProjectionForPayment(
  card: CreditCard,
  monthlyPayment: number
): ProjectionResult {
  let balance = card.currentBalance
  let totalInterest = 0
  let totalPaid = 0
  const projections: PaymentProjection[] = []
  let month = 0
  const maxMonths = 600

  const today = new Date()

  while (balance > 0.01 && month < maxMonths) {
    const interest = calculateInterestForMonth(balance, card.annualInterestRate)
    const principal = Math.min(monthlyPayment - interest, balance)

    if (principal <= 0) {
      break
    }

    balance -= principal
    totalInterest += interest
    totalPaid += monthlyPayment
    month++

    const projectionDate = new Date(today)
    projectionDate.setMonth(projectionDate.getMonth() + month)

    projections.push({
      month,
      payment: monthlyPayment,
      principalPaid: principal,
      interestPaid: interest,
      remainingBalance: Math.max(balance, 0),
      date: projectionDate
    })
  }

  return {
    months: month,
    totalInterest,
    totalPaid,
    projections
  }
}

export function calculateMinimumPayment(balance: number): number {
  return Math.max(balance * 0.05, 50)
}

export function calculateStatementCycleDates(
  closingDay: number,
  currentDate: Date = new Date()
): { startDate: Date; endDate: Date; dueDate: Date } {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const endDate = new Date(year, month, closingDay)

  const startDate = new Date(endDate)
  startDate.setMonth(startDate.getMonth() - 1)
  startDate.setDate(startDate.getDate() + 1)

  const dueDate = new Date(endDate)
  dueDate.setDate(dueDate.getDate() + 20)

  return { startDate, endDate, dueDate }
}
