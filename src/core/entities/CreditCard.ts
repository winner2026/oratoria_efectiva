/**
 * Entidad: CreditCard
 *
 * Representa una tarjeta de crédito del usuario.
 * Adaptada al schema de base de datos MVP.
 */
export interface CreditCard {
  id: string
  name: string                   // Nombre del banco (ej: "BBVA", "Santander")
  balance: number                // Saldo actual
  statementDate: Date            // Fecha de corte
  dueDate: Date                  // Fecha límite de pago
  interestRateMonthly: number    // Tasa de interés mensual (ej: 0.07 = 7%)
  createdAt: Date
  updatedAt: Date
  currentBalance: number
  annualInterestRate: number
}
