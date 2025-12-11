import { CreditCard } from '../entities/CreditCard'

/**
 * Interface: ICreditCardRepository
 *
 * Contrato para el repositorio de tarjetas de crédito.
 * Define las operaciones necesarias para el MVP.
 *
 * Clean Architecture:
 * - Esta interface vive en /core (dominio)
 * - La implementación vive en /infrastructure
 * - Esto permite cambiar la BD sin afectar el dominio
 */
export interface ICreditCardRepository {
  /**
   * Obtener una tarjeta por ID
   * @throws NotFoundError si no existe
   */
  getById(id: string): Promise<CreditCard>

  /**
   * Crear una nueva tarjeta de crédito
   */
  create(card: Omit<CreditCard, 'createdAt' | 'updatedAt'>): Promise<CreditCard>

  /**
   * Actualizar el balance de una tarjeta
   */
  updateBalance(id: string, balance: number): Promise<void>
}
