import { TransactionRepository } from "@/core/repositories/TransactionRepository";
import { CardRepository } from "@/core/repositories/CardRepository";

export class GenerateGraphData {
  constructor(
    private cards: CardRepository,
    private transactions: TransactionRepository
  ) {}

  async execute(userId: string) {
    const card = await this.cards.findByUser(userId);
    if (!card) return { line: [], bars: [], categories: {} };

    const txs = await this.transactions.findByCard(card.id);

    const sorted = [...txs].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const line = sorted.map((t) => ({
      time: new Date(t.fecha).toISOString().split("T")[0],
      value: Number(t.monto),
    }));

    const buckets: Record<string, number> = {};
    for (const t of sorted) {
      const key = new Date(t.fecha).toISOString().split("T")[0];
      buckets[key] = (buckets[key] || 0) + Number(t.monto);
    }

    const bars = Object.entries(buckets).map(([date, total]) => ({
      time: date,
      value: total,
    }));

    const categories: Record<string, number> = {};
    for (const t of sorted) {
      const cat = t.descripcion.split(" ")[0];
      categories[cat] = (categories[cat] || 0) + Number(t.monto);
    }

    return { line, bars, categories };
  }
}
