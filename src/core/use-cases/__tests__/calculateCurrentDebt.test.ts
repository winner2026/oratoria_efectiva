import { calculateCurrentDebt, CalculateCurrentDebtInput } from '../calculateCurrentDebt'
import { ValidationError, BusinessRuleError } from '../../errors'

/**
 * EJEMPLO CONCRETO (para UI y testing)
 *
 * Este archivo muestra cómo usar el caso de uso calculateCurrentDebt
 * con ejemplos reales basados en la especificación
 */

describe('calculateCurrentDebt', () => {
  /**
   * EJEMPLO 1: Caso básico - Usuario después del corte
   *
   * Input:
   * - balance: 5600
   * - statementDate: 2025-01-18
   * - dueDate: 2025-02-10
   * - today: 2025-01-22
   *
   * Output esperado:
   * - realDebt: 5600
   * - minimumPayment: 224
   * - noInterestPayment: 5600
   * - interestIfMinPayment: 167.2
   * - daysRemaining: 19
   * - isBeforeStatement: false
   * - cycleStatus: "after_cutoff"
   * - nextStatementDate: 2025-02-18
   */
  it('should calculate debt correctly for user after statement date', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 5600,
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10'),
      today: new Date('2025-01-22')
    }

    const result = await calculateCurrentDebt(input)

    expect(result.realDebt).toBe(5600)
    expect(result.minimumPayment).toBe(224) // max(5600 * 0.04, 200) = 224
    expect(result.noInterestPayment).toBe(5600)
    expect(result.interestIfMinPayment).toBeCloseTo(167.2, 1)
    expect(result.daysRemaining).toBe(19)
    expect(result.isBeforeStatement).toBe(false)
    expect(result.cycleStatus).toBe('after_cutoff')
    expect(result.nextStatementDate).toEqual(new Date('2025-02-18'))
  })

  /**
   * EJEMPLO 2: Usuario antes del corte
   */
  it('should calculate debt correctly for user before statement date', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 3000,
      statementDate: new Date('2025-02-10'),
      dueDate: new Date('2025-02-28'),
      today: new Date('2025-02-05')
    }

    const result = await calculateCurrentDebt(input)

    expect(result.realDebt).toBe(3000)
    expect(result.isBeforeStatement).toBe(true)
    expect(result.cycleStatus).toBe('before_cutoff')
  })

  /**
   * EJEMPLO 3: Balance bajo - debe aplicar el mínimo absoluto de $200
   */
  it('should apply absolute minimum payment of $200', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 1000, // 4% = 40, pero mínimo es 200
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10'),
      today: new Date('2025-01-22')
    }

    const result = await calculateCurrentDebt(input)

    expect(result.minimumPayment).toBe(200) // max(40, 200) = 200
  })

  /**
   * EJEMPLO 4: Con transacciones adicionales
   */
  it('should include transactions in real debt calculation', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 5000,
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10'),
      today: new Date('2025-01-22'),
      transactions: [
        {
          id: '1',
          cardId: 'card-1',
          type: 'PURCHASE' as any,
          amount: 500,
          description: 'Compra Amazon',
          date: new Date('2025-01-20'),
          createdAt: new Date()
        },
        {
          id: '2',
          cardId: 'card-1',
          type: 'PAYMENT' as any,
          amount: 1000,
          description: 'Pago',
          date: new Date('2025-01-21'),
          createdAt: new Date()
        }
      ]
    }

    const result = await calculateCurrentDebt(input)

    // 5000 + 500 - 1000 = 4500
    expect(result.realDebt).toBe(4500)
  })

  /**
   * EJEMPLO 5: Con planes MSI activos
   */
  it('should include MSI monthly payments in real debt', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 5000,
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10'),
      today: new Date('2025-01-22'),
      msiPlans: [
        {
          id: 'msi-1',
          cardId: 'card-1',
          transactionId: 'tx-1',
          totalAmount: 12000,
          numberOfMonths: 12,
          monthlyPayment: 1000,
          remainingMonths: 8,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2025-06-01'),
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'msi-2',
          cardId: 'card-1',
          transactionId: 'tx-2',
          totalAmount: 6000,
          numberOfMonths: 6,
          monthlyPayment: 1000,
          remainingMonths: 3,
          startDate: new Date('2024-10-01'),
          endDate: new Date('2025-04-01'),
          isActive: true,
          createdAt: new Date()
        }
      ]
    }

    const result = await calculateCurrentDebt(input)

    // 5000 + 1000 (MSI 1) + 1000 (MSI 2) = 7000
    expect(result.realDebt).toBe(7000)
  })

  /**
   * EJEMPLO 6: Validación - balance negativo debe lanzar error
   */
  it('should throw ValidationError for negative balance', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: -100,
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10')
    }

    await expect(calculateCurrentDebt(input)).rejects.toThrow(ValidationError)
  })

  /**
   * EJEMPLO 7: Validación - fecha de pago antes del corte debe lanzar error
   */
  it('should throw BusinessRuleError if dueDate is before statementDate', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 5000,
      statementDate: new Date('2025-02-10'),
      dueDate: new Date('2025-01-15') // ERROR: antes del corte
    }

    await expect(calculateCurrentDebt(input)).rejects.toThrow(BusinessRuleError)
  })

  /**
   * EJEMPLO 8: Sin deuda - intereses deben ser 0
   */
  it('should return zero interest if no debt remains after minimum payment', async () => {
    const input: CalculateCurrentDebtInput = {
      balance: 100, // Pago mínimo será 200, mayor que la deuda
      statementDate: new Date('2025-01-18'),
      dueDate: new Date('2025-02-10'),
      today: new Date('2025-01-22')
    }

    const result = await calculateCurrentDebt(input)

    expect(result.interestIfMinPayment).toBe(0)
  })
})
