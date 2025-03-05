import { injectable } from "inversify";
import { IUserRepository } from "../interfaces/IUser/IUserRepository";
import { User, UserModel } from "../entities/User";
import { Model } from "mongoose";
import { CustomError } from "../utils/error";

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Model<User>;
  constructor() {
    this.repository = UserModel;
  }

  async create(data: User): Promise<User> {
    const userInfo = await this.repository.findOne({ email: data.email });
    if (userInfo) {
      throw new CustomError(401, `${data.email} already exists`);
    }
    const user = new this.repository(data);
    return await user.save();
  }

  async update(id: number, details: Partial<User>): Promise<User | null> {
    return await this.repository.findByIdAndUpdate({ id }, details);
  }

  async find(condition: any): Promise<User | null> {
    return await this.repository.findOne(condition).lean();
  }

  async findAll(condition: any): Promise<User[]> {
    return await this.repository.find(condition);
  }
}
