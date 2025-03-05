import { User } from "../../entities/User";

export interface IUserInteractor {
  createUser(details: Partial<User>): Promise<User>;
  updateUser(id: number, details: Partial<User>): Promise<User | null>;
  getAllUsers(condition: any): Promise<User[]>;
  getUser(condition: any): Promise<User | null>;
}
