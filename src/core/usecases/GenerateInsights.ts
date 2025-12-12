import { TransactionRepository } from "@/core/repositories/TransactionRepository"
import { CardRepository } from "@/core/repositories/CardRepository"
import { FinancialEngine } from "@/core/usecases/FinancialEngine"

export class GenerateInsights {
  constructor(
    private cards: CardRepository,
    private transactions: TransactionRepository
  ) {}

  async execute(userId: string) {
    const card = await this.cards.findByUser(userId)
    if (!card) return null

    const txs = await this.transactions.findByCard(card.id)

    if (txs.length === 0) {
      return {
        totalMes: 0,
        promedioDiario: 0,
        diaMasGasto: null,
        mayorCompra: null,
        proyeccionMes: 0,
        recomendado: FinancialEngine.pagoRecomendado(card),
      }
    }

    const ahora = new Date()
    const mes = ahora.getMonth()
    const anio = ahora.getFullYear()

    const thisMonth = txs.filter((t) => {
      const f = new Date(t.fecha)
      return f.getMonth() === mes && f.getFullYear() === anio
    })

    const totalMes = thisMonth.reduce((sum, t) => sum + Number(t.monto), 0)

    const diaHoy = ahora.getDate()
    const promedioDiario = totalMes / diaHoy

    const gastoPorDia: Record<number, number> = {}
    for (const t of thisMonth) {
      const key = new Date(t.fecha).getDate()
      gastoPorDia[key] = (gastoPorDia[key] || 0) + Number(t.monto)
    }
    const diaMasGasto = Object.entries(gastoPorDia)
      .map(([dia, total]) => ({ dia: Number(dia), total }))
      .sort((a, b) => b.total - a.total)[0]

    const mayorCompra = [...thisMonth].sort(
      (a, b) => Number(b.monto) - Number(a.monto)
    )[0]

    const proyeccionMes = (promedioDiario * 30).toFixed(0)

    return {
      totalMes,
      promedioDiario,
      diaMasGasto,
      mayorCompra,
      proyeccionMes,
      recomendado: FinancialEngine.pagoRecomendado(card),
    }
  }
}
