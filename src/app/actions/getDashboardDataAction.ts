'use server'

/**
 * SERVER ACTION: Obtener datos del dashboard
 *
 * Principios:
 * - No contiene lógica de negocio (solo orquesta)
 * - No habla directamente con la DB (usa repositorios)
 * - Devuelve DTOs amigables para UI
 * - Es la frontera entre UI e infraestructura
 *
 * Clean Architecture:
 * - UI llama esta acción
 * - Acción orquesta caso de uso
 * - Caso de uso ejecuta lógica de negocio
 * - Repositorios acceden a la BD
 */

import { getDashboardData } from '@/core/use-cases/getDashboardData'
import { PostgresCreditCardRepository } from '@/infrastructure/repositories/PostgresCreditCardRepository'
import { PostgresTransactionRepository } from '@/infrastructure/repositories/PostgresTransactionRepository'

// Instanciar repositorios
const creditCardRepo = new PostgresCreditCardRepository()
const transactionRepo = new PostgresTransactionRepository()

/**
 * Obtener todos los datos necesarios para el dashboard
 *
 * @param creditCardId - ID de la tarjeta de crédito
 * @returns Datos consolidados del dashboard (DTO para UI)
 */
export async function getDashboardDataAction(creditCardId: string) {
  const result = await getDashboardData(
    { creditCardId },
    { creditCardRepo, transactionRepo }
  )

  return result // DTO para UI
}
