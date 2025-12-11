import { CreditCard } from '../core/entities/CreditCard'
import { Transaction } from '../core/entities/Transaction'
import { Projection } from '../core/entities/Projection'
import { PaymentRecommendation } from '../core/entities/PaymentRecommendation'

export interface CreateCreditCardRequest {
  bankName: string
  lastFourDigits: string
  creditLimit: number
  currentBalance: number
  statementClosingDay: number
  paymentDueDay: number
  annualInterestRate: number
}

export interface CreateTransactionRequest {
  cardId: string
  type: 'PURCHASE' | 'PAYMENT' | 'INTEREST' | 'FEE'
  amount: number
  description: string
  date?: string
}

export interface CreateProjectionRequest {
  cardId: string
  monthlyPayment: number
}

export interface DashboardResponse {
  cards: CreditCard[]
  totalDebt: number
  totalCreditLimit: number
  overallUtilization: number
  recommendations: PaymentRecommendation[]
  recentTransactions: Transaction[]
}

export interface ProjectionResponse {
  projection: Projection
  recommendation: PaymentRecommendation
}
