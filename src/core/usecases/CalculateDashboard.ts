import { CardRepository } from "@/core/repositories/CardRepository";
import { FinancialEngine } from "@/core/usecases/FinancialEngine";

export class CalculateDashboard {
  constructor(private cards: CardRepository) {}

  async execute(userId: string) {
    const card = await this.cards.findByUser(userId);
    if (!card) return null;

    const interes = FinancialEngine.calcularInteresMensual(card.saldoActual, card.tasaMensual);
    const deuda = FinancialEngine.proyectarDeudaSinPago(card.saldoActual, card.tasaMensual);
    const dias = FinancialEngine.diasHasta(card.fechaVencimiento);
    const riesgo = FinancialEngine.riesgo(card);
    const recomendado = FinancialEngine.pagoRecomendado(card);

    return {
      card,
      interes,
      deuda,
      dias,
      riesgo,
      recomendado,
    };
  }
}
