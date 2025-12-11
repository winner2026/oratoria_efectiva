/**
 * Calcula la diferencia en días entre dos fechas
 */
export function differenceInDays(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate())
  return Math.floor((utc1 - utc2) / msPerDay)
}

/**
 * Calcula la siguiente fecha de corte basada en el día del mes
 */
export function getNextStatementDate(
  statementDay: number,
  currentDate: Date
): Date {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  let nextStatement = new Date(year, month, statementDay)

  // Si ya pasó la fecha de corte este mes, usar el siguiente mes
  if (currentDate >= nextStatement) {
    nextStatement = new Date(year, month + 1, statementDay)
  }

  return nextStatement
}

/**
 * Determina si la fecha actual está antes del corte
 */
export function isBeforeStatementDate(
  today: Date,
  statementDate: Date
): boolean {
  return today < statementDate
}

/**
 * Calcula los días entre dos fechas (útil para intereses diarios)
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  return Math.abs(differenceInDays(endDate, startDate))
}

/**
 * Obtiene el estado del ciclo actual
 */
export function getCycleStatus(
  today: Date,
  statementDate: Date
): 'before_cutoff' | 'after_cutoff' {
  return isBeforeStatementDate(today, statementDate)
    ? 'before_cutoff'
    : 'after_cutoff'
}
