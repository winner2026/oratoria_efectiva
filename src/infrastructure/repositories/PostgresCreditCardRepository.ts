import { CreditCard } from '../../core/entities/CreditCard'
import { ICreditCardRepository } from '../../core/repositories/ICreditCardRepository'
import { NotFoundError } from '../../core/errors'
import { queryDb } from '../db/client'

/**
 * Implementación PostgreSQL del repositorio de tarjetas de crédito
 *
 * Responsabilidades:
 * - Mapear entre filas de BD y entidades del dominio
 * - Ejecutar queries SQL
 * - Lanzar errores del dominio (NotFoundError)
 *
 * Clean Architecture:
 * - Implementa la interface del dominio (ICreditCardRepository)
 * - El dominio NO conoce esta implementación
 * - Puede ser reemplazado por cualquier otra BD
 */
export class PostgresCreditCardRepository implements ICreditCardRepository {
  /**
   * Obtener una tarjeta por ID
   * @throws NotFoundError si no existe la tarjeta
   */
  async getById(id: string): Promise<CreditCard> {
    const result = await queryDb<any>(
      `SELECT * FROM credit_cards WHERE id = $1 LIMIT 1`,
      [id]
    )

    if (result.length === 0) {
      throw new NotFoundError('CreditCard', id)
    }

    return this.mapRowToEntity(result[0])
  }

  /**
   * Crear una nueva tarjeta de crédito
   */
  async create(card: Omit<CreditCard, 'createdAt' | 'updatedAt'>): Promise<CreditCard> {
    const result = await queryDb<any>(
      `INSERT INTO credit_cards
       (id, name, balance, statement_date, due_date, interest_rate_monthly)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        card.id,
        card.name,
        card.balance,
        card.statementDate,
        card.dueDate,
        card.interestRateMonthly
      ]
    )

    return this.mapRowToEntity(result[0])
  }

  /**
   * Actualizar el balance de una tarjeta
   */
  async updateBalance(id: string, balance: number): Promise<void> {
    await queryDb(
      `UPDATE credit_cards
       SET balance = $1, updated_at = now()
       WHERE id = $2`,
      [balance, id]
    )
  }

  /**
   * Mapear fila de BD a entidad del dominio
   * Convierte snake_case → camelCase
   * Convierte tipos de BD a tipos de TypeScript
   */
  private mapRowToEntity(row: any): CreditCard {
    return {
      id: row.id,
      name: row.name,
      balance: parseFloat(row.balance),
      statementDate: new Date(row.statement_date),
      dueDate: new Date(row.due_date),
      interestRateMonthly: parseFloat(row.interest_rate_monthly),
      currentBalance: parseFloat(row.balance),
      annualInterestRate: parseFloat(row.interest_rate_monthly) * 12,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }
}
