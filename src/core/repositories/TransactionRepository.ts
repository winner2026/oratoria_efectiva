import { Transaction } from "../entities/Transaction";

export interface TransactionRepository {
  findByCard(cardId: string): Promise<Transaction[]>;
  create(tx: Transaction): Promise<void>;
}
