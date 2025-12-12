import { CardRepository } from "@/core/repositories/CardRepository";
import { FinancialEngine } from "@/core/usecases/FinancialEngine";

export class ProjectDebt {
  constructor(private cards: CardRepository) {}

  async execute(userId: string, pago: number) {
    const card = await this.cards.findByUser(userId);
    if (!card) throw new Error("Card not found");

    const sinPago = FinancialEngine.proyectarDeudaSinPago(card.saldoActual, card.tasaMensual);
    const conPago = FinancialEngine.proyectarDeudaConPago(card.saldoActual, card.tasaMensual, pago);

    return {
      sinPago,
      conPago,
      ahorro: sinPago - conPago,
    };
  }
}
