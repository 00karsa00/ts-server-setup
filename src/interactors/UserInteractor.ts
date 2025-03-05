import { inject, injectable } from "inversify";
import { INTERFACE_TYPE, USER_INTERFACE_TYPE } from "../utils/appConst";
import { IUserInteractor } from "../interfaces/IUser/IUserInteractor";
import { User } from "../entities/User";
import { IUserRepository } from "../interfaces/IUser/IUserRepository";

@injectable()
export class UserInteractor implements IUserInteractor {
  private repository: IUserRepository;
  //   private mailer: IMailer;
  //   private broker: IMessageBroker;

  constructor(
    @inject(USER_INTERFACE_TYPE.UserRepository) repository: IUserRepository
    // @inject(INTERFACE_TYPE.Mailer) mailer: IMailer,
    // @inject(INTERFACE_TYPE.MessageBroker) broker: IMessageBroker
  ) {
    this.repository = repository;
    // this.mailer = mailer;
    // this.broker = broker;
  }

  async createUser(details: User): Promise<User> {
    return this.repository.create(details);
  }

  async updateUser(id: number, details: User): Promise<User | null> {
    return this.repository.update(id, details);
  }
  async getAllUsers(condition: any): Promise<User[]> {
    return this.repository.findAll(condition);
  }

  async getUser(condition: any): Promise<User | null> {
    console.log("condition 2 => ", condition);
    return this.repository.find(condition);
  }

  getUserBasedByInfo(condition: any): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
