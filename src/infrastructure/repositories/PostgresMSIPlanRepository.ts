import { MSIPlan } from '../../core/entities/MSIPlan'
import { IMSIPlanRepository } from '../../core/repositories/IMSIPlanRepository'
import { queryDb } from '../db/client'

/**
 * Implementación PostgreSQL del repositorio de planes MSI
 *
 * Responsabilidades:
 * - Mapear entre filas de BD y entidades del dominio
 * - Ejecutar queries SQL
 * - Mantener la integridad de los planes MSI
 *
 * Clean Architecture:
 * - Implementa la interface del dominio (IMSIPlanRepository)
 * - El dominio NO conoce esta implementación
 * - Puede ser reemplazado por cualquier otra BD
 */
export class PostgresMSIPlanRepository implements IMSIPlanRepository {
  /**
   * Crear un nuevo plan MSI
   */
  async create(msiPlan: MSIPlan): Promise<void> {
    await queryDb(
      `INSERT INTO msi_plans
       (id, transaction_id, total_amount, months, monthly_payment, start_date, remaining_months)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        msiPlan.id,
        msiPlan.transactionId,
        msiPlan.totalAmount,
        msiPlan.numberOfMonths,
        msiPlan.monthlyPayment,
        msiPlan.startDate,
        msiPlan.remainingMonths
      ]
    )
  }

  /**
   * Obtener planes MSI activos de una tarjeta
   */
  async getActiveByCreditCardId(creditCardId: string): Promise<MSIPlan[]> {
    const result = await queryDb<any>(
      `SELECT msi.*
       FROM msi_plans msi
       JOIN transactions t ON t.id = msi.transaction_id
       WHERE t.credit_card_id = $1
         AND msi.remaining_months > 0
       ORDER BY msi.start_date DESC`,
      [creditCardId]
    )

    return result.map((row) => this.mapRowToEntity(row))
  }

  /**
   * Mapear fila de BD a entidad del dominio
   * Convierte snake_case → camelCase
   * Convierte tipos de BD a tipos de TypeScript
   */
  private mapRowToEntity(row: any): MSIPlan {
    return {
      id: row.id,
      cardId: row.card_id,
      transactionId: row.transaction_id,
      totalAmount: parseFloat(row.total_amount),
      numberOfMonths: row.months,
      monthlyPayment: parseFloat(row.monthly_payment),
      remainingMonths: row.remaining_months,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      isActive: row.remaining_months > 0,
      createdAt: new Date(row.created_at)
    }
  }
}
