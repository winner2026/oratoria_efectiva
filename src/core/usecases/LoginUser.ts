import { UserRepository } from "@/core/repositories/UserRepository";
import bcrypt from "bcryptjs";

export class LoginUser {
  constructor(private users: UserRepository) {}

  async execute({ email, password }: { email: string; password: string }) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    return user;
  }
}
