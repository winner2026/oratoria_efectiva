export interface PaymentRecommendation {
  cardId: string
  minimumPayment: number
  recommendedPayment: number
  optimalPayment: number
  reasoning: string
  projectedMonthsToPayOff: number
  totalInterestIfMinimum: number
  totalInterestIfRecommended: number
  savingsVsMinimum: number
}
