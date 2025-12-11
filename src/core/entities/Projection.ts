export interface PaymentProjection {
  month: number
  payment: number
  principalPaid: number
  interestPaid: number
  remainingBalance: number
  date: Date
}

export interface Projection {
  id: string
  cardId: string
  userId: string
  monthlyPayment: number
  projectedMonths: number
  totalInterest: number
  totalPaid: number
  projections: PaymentProjection[]
  createdAt: Date
}
