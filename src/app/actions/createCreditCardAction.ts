'use server'

/**
 * SERVER ACTION: Crear tarjeta de crédito (Onboarding)
 *
 * Principios:
 * - Validación con Zod
 * - Persiste en NeonDB
 * - Sin lógica de negocio (solo orquestación)
 * - Activa el flywheel del usuario
 *
 * Diseño Emocional (Donald Norman):
 * - Visceral: Formulario limpio y claro
 * - Behavioral: Ultra fácil de completar
 * - Reflective: "Ahora tengo control de mi tarjeta"
 */

import { z } from 'zod'
import { PostgresCreditCardRepository } from '@/infrastructure/repositories/PostgresCreditCardRepository'

/**
 * Schema de validación con Zod
 * Asegura integridad de datos desde el input del usuario
 */
const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').default('Mi Tarjeta'),
  balance: z.number().min(0, 'El saldo debe ser mayor o igual a 0'),
  statementDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  interestRateMonthly: z.number().min(0).max(1).default(0.07) // 7% mensual default
})

/**
 * Crear una nueva tarjeta de crédito en el onboarding
 *
 * @param formData - Datos del formulario de onboarding
 * @returns ID de la tarjeta creada
 */
export async function createCreditCardAction(formData: FormData) {
  // 1. Validar datos con Zod
  const parsed = schema.parse({
    name: formData.get('name') || 'Mi Tarjeta',
    balance: Number(formData.get('balance')),
    statementDate: formData.get('statementDate'),
    dueDate: formData.get('dueDate'),
    interestRateMonthly: 0.07 // 7% mensual (tasa promedio mexicana)
  })

  // 2. Generar ID único
  const id = crypto.randomUUID()

  // 3. Crear tarjeta en BD usando repositorio
  const repo = new PostgresCreditCardRepository()

  await repo.create({
    id,
    name: parsed.name,
    balance: parsed.balance,
    statementDate: parsed.statementDate,
    dueDate: parsed.dueDate,
    interestRateMonthly: parsed.interestRateMonthly,
    currentBalance: parsed.balance,
    annualInterestRate: parsed.interestRateMonthly * 12
  })

  // 4. Retornar ID para redirección al dashboard
  const newCard = { id }
  console.log('?? Created card ID:', newCard.id)
  return newCard
}
