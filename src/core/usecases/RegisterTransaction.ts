import { randomUUID } from "crypto";
import { CardRepository } from "@/core/repositories/CardRepository";
import { TransactionRepository } from "@/core/repositories/TransactionRepository";
import { Transaction } from "@/core/entities/Transaction";

export class RegisterTransaction {
  constructor(
    private cards: CardRepository,
    private transactions: TransactionRepository
  ) {}

  async execute({
    userId,
    monto,
    descripcion,
  }: {
    userId: string;
    monto: number;
    descripcion: string;
  }) {
    if (monto <= 0) throw new Error("El monto debe ser mayor a 0");

    const card = await this.cards.findByUser(userId);
    if (!card) throw new Error("No hay tarjeta registrada");

    const tx: Transaction = {
      id: randomUUID(),
      userId,
      cardId: card.id,
      monto,
      descripcion,
      fecha: new Date(),
      createdAt: new Date(),
    };

    await this.transactions.create(tx);

    const nuevoSaldo = card.saldoActual + monto;

    const updatedCard = {
      ...card,
      saldoActual: nuevoSaldo,
    };

    await this.cards.update(updatedCard);

    return {
      nuevoSaldo,
      transaccion: tx,
    };
  }
}
