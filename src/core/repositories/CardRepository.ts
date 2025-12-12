export interface CardEntity {
  id: string;
  userId: string;
  tasaMensual: number;
  fechaCorte: Date;
  fechaVencimiento: Date;
  saldoActual: number;
  createdAt: Date;
}

export interface CardRepository {
  findById(id: string): Promise<CardEntity | null>;
  findByUser(userId: string): Promise<CardEntity | null>;
  create(card: CardEntity): Promise<void>;
  update(card: CardEntity): Promise<void>;
}
