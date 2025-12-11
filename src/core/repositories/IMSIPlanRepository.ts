import { MSIPlan } from '../entities/MSIPlan'

/**
 * Interface: IMSIPlanRepository
 *
 * Contrato para el repositorio de planes MSI.
 * Define las operaciones necesarias para el MVP.
 *
 * Clean Architecture:
 * - Esta interface vive en /core (dominio)
 * - La implementación vive en /infrastructure
 * - Esto permite cambiar la BD sin afectar el dominio
 */
export interface IMSIPlanRepository {
  /**
   * Crear un nuevo plan MSI
   */
  create(msiPlan: MSIPlan): Promise<void>

  /**
   * Obtener planes MSI activos de una tarjeta
   */
  getActiveByCreditCardId(creditCardId: string): Promise<MSIPlan[]>
}
