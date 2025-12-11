import { Transaction, TransactionType } from '../../core/entities/Transaction'
import { ITransactionRepository } from '../../core/repositories/ITransactionRepository'
import { queryDb } from '../db/client'

/**
 * Implementación PostgreSQL del repositorio de transacciones
 *
 * Responsabilidades:
 * - Mapear entre filas de BD y entidades del dominio
 * - Ejecutar queries SQL
 * - Mantener la integridad de las transacciones
 *
 * Clean Architecture:
 * - Implementa la interface del dominio (ITransactionRepository)
 * - El dominio NO conoce esta implementación
 * - Puede ser reemplazado por cualquier otra BD
 */
export class PostgresTransactionRepository implements ITransactionRepository {
  /**
   * Obtener todas las transacciones de una tarjeta
   * Ordenadas por fecha descendente
   */
  async getByCreditCardId(creditCardId: string): Promise<Transaction[]> {
    const result = await queryDb<any>(
      `SELECT * FROM transactions
       WHERE credit_card_id = $1
       ORDER BY date DESC`,
      [creditCardId]
    )

    return result.map((row) => this.mapRowToEntity(row))
  }

  /**
   * Crear una nueva transacción
   */
  async create(transaction: Transaction): Promise<void> {
    await queryDb(
      `INSERT INTO transactions
       (id, credit_card_id, amount, date, description, type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        transaction.id,
        transaction.creditCardId,
        transaction.amount,
        transaction.date,
        transaction.description || null,
        transaction.type
      ]
    )
  }

  /**
   * Mapear fila de BD a entidad del dominio
   * Convierte snake_case → camelCase
   * Convierte tipos de BD a tipos de TypeScript
   */
  private mapRowToEntity(row: any): Transaction {
    return {
      id: row.id,
      creditCardId: row.credit_card_id,
      amount: parseFloat(row.amount),
      date: new Date(row.date),
      description: row.description,
      type: row.type as TransactionType,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }
}
