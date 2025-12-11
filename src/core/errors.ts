export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
    Object.setPrototypeOf(this, DomainError.prototype)
  }
}

export class ValidationError extends DomainError {
  public readonly field?: string
  public readonly violations: string[]

  constructor(message: string, field?: string, violations: string[] = []) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.violations = violations
    Object.setPrototypeOf(this, ValidationError.prototype)
  }

  static fromField(field: string, violation: string): ValidationError {
    return new ValidationError(`Validation failed for field: ${field}`, field, [violation])
  }

  static fromMultiple(violations: Record<string, string[]>): ValidationError {
    const allViolations = Object.entries(violations).flatMap(([field, errors]) =>
      errors.map(error => `${field}: ${error}`)
    )
    return new ValidationError('Multiple validation errors', undefined, allViolations)
  }
}

export class NotFoundError extends DomainError {
  public readonly entityType: string
  public readonly entityId: string

  constructor(entityType: string, entityId: string) {
    super(`${entityType} with id ${entityId} not found`)
    this.name = 'NotFoundError'
    this.entityType = entityType
    this.entityId = entityId
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class BusinessRuleError extends DomainError {
  public readonly ruleType: string

  constructor(message: string, ruleType: string = 'BUSINESS_RULE') {
    super(message)
    this.name = 'BusinessRuleError'
    this.ruleType = ruleType
    Object.setPrototypeOf(this, BusinessRuleError.prototype)
  }
}

export class InsufficientCreditError extends BusinessRuleError {
  constructor(available: number, required: number) {
    super(
      `Insufficient credit: available ${available}, required ${required}`,
      'INSUFFICIENT_CREDIT'
    )
    this.name = 'InsufficientCreditError'
    Object.setPrototypeOf(this, InsufficientCreditError.prototype)
  }
}

export class InvalidPaymentError extends BusinessRuleError {
  constructor(reason: string) {
    super(`Invalid payment: ${reason}`, 'INVALID_PAYMENT')
    this.name = 'InvalidPaymentError'
    Object.setPrototypeOf(this, InvalidPaymentError.prototype)
  }
}
