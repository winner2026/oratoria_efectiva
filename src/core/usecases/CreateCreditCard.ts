import { CardRepository } from "@/core/repositories/CardRepository";
import { CardEntity } from "@/core/entities/CreditCard";
import { randomUUID } from "crypto";

export class CreateCreditCard {
  constructor(private cards: CardRepository) {}

  async execute({
    userId,
    tasaMensual,
    fechaCorte,
    fechaVencimiento,
  }: {
    userId: string;
    tasaMensual: number;
    fechaCorte: Date;
    fechaVencimiento: Date;
  }) {
    const card: CardEntity = {
      id: randomUUID(),
      userId,
      saldoActual: 0,
      tasaMensual,
      fechaCorte,
      fechaVencimiento,
      createdAt: new Date(),
    };

    await this.cards.create(card);
    return card;
  }
}
