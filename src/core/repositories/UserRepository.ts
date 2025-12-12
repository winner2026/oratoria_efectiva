export interface UserEntity {
  id: string;
  email: string;
  password: string;
  plan: string;
  createdAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<void>;
  update(user: UserEntity): Promise<void>;
}
