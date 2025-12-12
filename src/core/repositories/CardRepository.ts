import { CardEntity } from "../entities/CreditCard";

export interface CardRepository {
  findById(id: string): Promise<CardEntity | null>;
  findByUser(userId: string): Promise<CardEntity | null>;
  create(card: CardEntity): Promise<void>;
  update(card: CardEntity): Promise<void>;
}
