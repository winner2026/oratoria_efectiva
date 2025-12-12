import { TransactionRepository } from "@/core/repositories/TransactionRepository";
import { CardRepository } from "@/core/repositories/CardRepository";

export class ListTransactionsByCard {
  constructor(
    private cards: CardRepository,
    private transactions: TransactionRepository
  ) {}

  async execute(userId: string) {
    const card = await this.cards.findByUser(userId);
    if (!card) return [];

    const list = await this.transactions.findByCard(card.id);

    return list.map((tx) => ({
      ...tx,
      monto: Number(tx.monto),
      fechaFormatted: new Date(tx.fecha).toLocaleDateString(),
    }));
  }
}
