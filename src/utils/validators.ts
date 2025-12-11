import { z } from 'zod'

export const creditCardSchema = z.object({
  bankName: z.string().min(1, 'Nombre del banco requerido'),
  lastFourDigits: z.string().length(4, 'Deben ser 4 dígitos'),
  creditLimit: z.number().positive('Límite debe ser positivo'),
  currentBalance: z.number().min(0, 'Balance no puede ser negativo'),
  statementClosingDay: z.number().min(1).max(31),
  paymentDueDay: z.number().min(1).max(31),
  annualInterestRate: z.number().min(0).max(100)
})

export const transactionSchema = z.object({
  cardId: z.string().uuid(),
  type: z.enum(['PURCHASE', 'PAYMENT', 'INTEREST', 'FEE']),
  amount: z.number().positive('Monto debe ser positivo'),
  description: z.string().min(1, 'Descripción requerida'),
  date: z.date().optional()
})

export const projectionSchema = z.object({
  cardId: z.string().uuid(),
  monthlyPayment: z.number().positive('Pago mensual debe ser positivo')
})

export function validateCreditCard(data: unknown) {
  return creditCardSchema.parse(data)
}

export function validateTransaction(data: unknown) {
  return transactionSchema.parse(data)
}

export function validateProjection(data: unknown) {
  return projectionSchema.parse(data)
}
