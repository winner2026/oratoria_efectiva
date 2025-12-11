import { Projection } from '../entities/Projection'

export interface IProjectionRepository {
  findById(id: string): Promise<Projection | null>
  findByCardId(cardId: string): Promise<Projection[]>
  create(projection: Omit<Projection, 'id' | 'createdAt'>): Promise<Projection>
  delete(id: string): Promise<void>
}
