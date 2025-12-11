export interface StatementCycle {
  id: string
  cardId: string
  startDate: Date
  endDate: Date
  paymentDueDate: Date
  minimumPayment: number
  totalBalance: number
  interestCharged: number
  isPaid: boolean
  createdAt: Date
}
