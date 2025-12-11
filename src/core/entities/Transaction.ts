/**
 * Entidad: Transaction
 *
 * Representa una transacción (compra normal o MSI).
 * Adaptada al schema de base de datos MVP.
 */

export enum TransactionType {
  NORMAL = 'NORMAL',
  MSI = 'MSI'
}

export interface Transaction {
  id: string
  creditCardId: string           // FK a credit_cards
  amount: number
  date: Date
  description?: string           // Opcional
  type: TransactionType          // 'NORMAL' o 'MSI'
  createdAt: Date
  updatedAt: Date
}
