import { UserEntity } from "../entities/User";

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
}
