import { CardRepository } from "@/core/repositories/CardRepository";
import { CardEntity } from "@/core/entities/CreditCard";
import { query } from "../db/client";

export class NeonCardRepository implements CardRepository {
  async findByUser(userId: string): Promise<CardEntity | null> {
    const res = await query(
      `SELECT * FROM credit_cards WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (res.rowCount === 0) return null;

    const row = res.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      saldoActual: parseFloat(row.saldo_actual),
      tasaMensual: parseFloat(row.tasa_mensual),
      fechaCorte: row.fecha_corte,
      fechaVencimiento: row.fecha_vencimiento,
      createdAt: row.created_at,
    };
  }

  async findById(id: string): Promise<CardEntity | null> {
    const res = await query(
      `SELECT * FROM credit_cards WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (res.rowCount === 0) return null;

    const row = res.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      saldoActual: parseFloat(row.saldo_actual),
      tasaMensual: parseFloat(row.tasa_mensual),
      fechaCorte: row.fecha_corte,
      fechaVencimiento: row.fecha_vencimiento,
      createdAt: row.created_at,
    };
  }

  async create(card: CardEntity): Promise<void> {
    await query(
      `INSERT INTO credit_cards 
      (id, user_id, saldo_actual, tasa_mensual, fecha_corte, fecha_vencimiento, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        card.id,
        card.userId,
        card.saldoActual,
        card.tasaMensual,
        card.fechaCorte,
        card.fechaVencimiento,
        card.createdAt,
      ]
    );
  }

  async update(card: CardEntity): Promise<void> {
    await query(
      `UPDATE credit_cards
       SET saldo_actual = $1,
           tasa_mensual = $2,
           fecha_corte = $3,
           fecha_vencimiento = $4,
           updated_at = now()
       WHERE id = $5`,
      [
        card.saldoActual,
        card.tasaMensual,
        card.fechaCorte,
        card.fechaVencimiento,
        card.id,
      ]
    );
  }
}
