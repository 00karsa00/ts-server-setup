import { User } from "../../entities/User";

export interface IUserRepository {
  create(data: User): Promise<User>;
  update(id: number, details: User): Promise<User | null>;
  find(condition: any): Promise<User | null>;
  findAll(condition: any): Promise<User[]>;
}
