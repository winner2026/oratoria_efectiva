export interface MSIPlan {
  id: string
  cardId: string
  transactionId: string
  totalAmount: number
  numberOfMonths: number
  monthlyPayment: number
  remainingMonths: number
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
}
