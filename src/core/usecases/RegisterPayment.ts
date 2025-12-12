import { CardRepository } from "@/core/repositories/CardRepository";
import { FinancialEngine } from "@/core/usecases/FinancialEngine";

export class RegisterPayment {
  constructor(private cards: CardRepository) {}

  async execute({
    userId,
    monto,
  }: {
    userId: string;
    monto: number;
  }) {
    if (monto <= 0) throw new Error("El monto debe ser mayor a 0");

    const card = await this.cards.findByUser(userId);
    if (!card) throw new Error("No se encontró la tarjeta del usuario");

    const nuevoSaldo = Math.max(card.saldoActual - monto, 0);

    const updated = {
      ...card,
      saldoActual: nuevoSaldo,
    };

    await this.cards.update(updated);

    const proyeccion = FinancialEngine.proyectarDeudaSinPago(
      updated.saldoActual,
      updated.tasaMensual
    );

    return {
      nuevoSaldo,
      proyeccion,
    };
  }
}
