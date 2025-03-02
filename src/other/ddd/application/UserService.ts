import bcrypt from "bcryptjs";
import { User } from "../domain/User";
import { Database } from "../infrastructure/Database";

export class UserService {
  private db = new Database().knexInstance;

  public async createUser(details: any): Promise<User> {
    const { name, email, password, role } = details;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.db("users").insert({ name, email, password: hashedPassword, role }).returning("*");
    return new User(user.id, user.name, user.email, user.password, user.role);
  }

  public async getUsers(): Promise<User[]> {
    const users = await this.db("users").select("*");
    return users.map(user => new User(user.id, user.name, user.email, user.password, user.role));
  }
}
