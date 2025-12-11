'use server'

/**
 * SERVER ACTION: Agregar transacción
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

import { addTransaction } from '@/core/use-cases/addTransaction'
import { PostgresTransactionRepository } from '@/infrastructure/repositories/PostgresTransactionRepository'
import { PostgresMSIPlanRepository } from '@/infrastructure/repositories/PostgresMSIPlanRepository'

// Instanciar repositorios
const transactionRepo = new PostgresTransactionRepository()
const msiPlanRepo = new PostgresMSIPlanRepository()

/**
 * Input para agregar transacción (DTO desde UI)
 */
export interface AddTransactionInput {
  amount: number
  date: Date
  description?: string
  isMSI?: boolean
  msiMonths?: number
}

/**
 * Agregar una nueva transacción (compra normal o MSI)
 *
 * @param input - Datos de la transacción
 * @returns Mensaje de confirmación para mostrar en UI
 */
export async function addTransactionAction(input: AddTransactionInput) {
  // 1. Crear entidad + MSI plan (caso de uso ejecuta lógica de negocio)
  const { transaction, msiPlan, message } = addTransaction(input)

  // 2. Persistir transacción en DB
  await transactionRepo.create(transaction)

  // 3. Persistir MSI plan (si existe)
  if (msiPlan) {
    await msiPlanRepo.create(msiPlan)
  }

  // 4. Retornar mensaje para UI
  return { message }
}
