export interface TransactionEntity {
  id: string;
  userId: string;
  cardId: string;
  monto: number;
  descripcion: string;
  fecha: Date;
  createdAt: Date;
}

export interface TransactionRepository {
  findByCard(cardId: string): Promise<TransactionEntity[]>;
  create(tx: TransactionEntity): Promise<void>;
}
