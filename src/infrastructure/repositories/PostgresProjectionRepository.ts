import { Projection } from '../../core/entities/Projection'
import { IProjectionRepository } from '../../core/repositories/IProjectionRepository'
import { queryDb } from '../db/client'

export class PostgresProjectionRepository implements IProjectionRepository {
  async findById(id: string): Promise<Projection | null> {
    const result = await queryDb<any>(
      'SELECT * FROM projections WHERE id = $1',
      [id]
    )

    if (result.length === 0) return null

    return this.mapToEntity(result[0])
  }

  async findByCardId(cardId: string): Promise<Projection[]> {
    const result = await queryDb<any>(
      'SELECT * FROM projections WHERE card_id = $1 ORDER BY created_at DESC',
      [cardId]
    )

    return result.map(this.mapToEntity)
  }

  async create(projection: Omit<Projection, 'id' | 'createdAt'>): Promise<Projection> {
    const result = await queryDb<any>(
      `INSERT INTO projections
       (card_id, user_id, monthly_payment, projected_months, total_interest, total_paid, projections)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        projection.cardId,
        projection.userId,
        projection.monthlyPayment,
        projection.projectedMonths,
        projection.totalInterest,
        projection.totalPaid,
        JSON.stringify(projection.projections)
      ]
    )

    return this.mapToEntity(result[0])
  }

  async delete(id: string): Promise<void> {
    await queryDb('DELETE FROM projections WHERE id = $1', [id])
  }

  private mapToEntity(row: any): Projection {
    return {
      id: row.id,
      cardId: row.card_id,
      userId: row.user_id,
      monthlyPayment: parseFloat(row.monthly_payment),
      projectedMonths: row.projected_months,
      totalInterest: parseFloat(row.total_interest),
      totalPaid: parseFloat(row.total_paid),
      projections: JSON.parse(row.projections),
      createdAt: new Date(row.created_at)
    }
  }
}
