import { UserRepository } from "@/core/repositories/UserRepository";
import { UserEntity } from "@/core/entities/User";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export class RegisterUser {
  constructor(private users: UserRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const user: UserEntity = {
      id: randomUUID(),
      email,
      password: passwordHash,
      createdAt: new Date(),
      plan: "free",
    };

    await this.users.create(user);
    return user;
  }
}
