import { Transaction } from '../entities/Transaction'

/**
 * Interface: ITransactionRepository
 *
 * Contrato para el repositorio de transacciones.
 * Define las operaciones necesarias para el MVP.
 *
 * Clean Architecture:
 * - Esta interface vive en /core (dominio)
 * - La implementación vive en /infrastructure
 * - Esto permite cambiar la BD sin afectar el dominio
 */
export interface ITransactionRepository {
  /**
   * Obtener todas las transacciones de una tarjeta
   * Ordenadas por fecha descendente
   */
  getByCreditCardId(creditCardId: string): Promise<Transaction[]>

  /**
   * Crear una nueva transacción
   */
  create(transaction: Transaction): Promise<void>
}
