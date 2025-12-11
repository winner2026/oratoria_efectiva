export function calculateMonthlyInterestRate(annualRate: number): number {
  return annualRate / 12 / 100
}

export function calculateInterestForMonth(
  balance: number,
  annualInterestRate: number
): number {
  const monthlyRate = calculateMonthlyInterestRate(annualInterestRate)
  return balance * monthlyRate
}

export function calculateTotalInterest(
  initialBalance: number,
  monthlyPayment: number,
  annualInterestRate: number
): { totalInterest: number; months: number } {
  let balance = initialBalance
  let totalInterest = 0
  let months = 0
  const maxMonths = 600

  while (balance > 0 && months < maxMonths) {
    const interest = calculateInterestForMonth(balance, annualInterestRate)
    totalInterest += interest

    const principal = monthlyPayment - interest
    balance -= principal
    months++

    if (balance < 0) balance = 0
  }

  return { totalInterest, months }
}
