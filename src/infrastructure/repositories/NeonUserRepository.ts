import { UserRepository } from "@/core/repositories/UserRepository";
import { UserEntity } from "@/core/entities/User";
import { query } from "../db/client";

export class NeonUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await query(
      `SELECT id, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) return null;

    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      password: row.password_hash,
      plan: row.plan ?? "free",
      createdAt: row.created_at,
    };
  }

  async findById(id: string): Promise<UserEntity | null> {
    const result = await query(
      `SELECT id, email, password_hash, created_at FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (result.rowCount === 0) return null;

    const row = result.rows[0];

    return {
      id: row.id,
      email: row.email,
      password: row.password_hash,
      plan: row.plan ?? "free",
      createdAt: row.created_at,
    };
  }

  async create(user: UserEntity): Promise<void> {
    await query(
      `INSERT INTO users (id, email, password_hash, created_at)
       VALUES ($1, $2, $3, $4)`,
      [user.id, user.email, user.password, user.createdAt]
    );
  }

  async update(user: UserEntity): Promise<void> {
    await query(
      `UPDATE users
       SET email = $1,
           password_hash = $2,
           plan = $3
       WHERE id = $4`,
      [user.email, user.password, user.plan, user.id]
    );
  }
}
