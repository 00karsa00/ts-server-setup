// import { injectable } from "inversify";
// import { EqualOperator, Repository, ReturnDocument } from "typeorm";
// import { AppDataSource } from "../config/database/typeOrm";
// import { IUserRepository } from "../interfaces/IUser/IUserRepository";
// import { User } from "../entities/User";

// @injectable()
// export class UserRepository implements IUserRepository {
//   private repository: Repository<User>;
//   constructor() {
//     this.repository = AppDataSource.getRepository(User);
//   }

//   async create(data: User): Promise<any> {
//     const user = this.repository.create(data)
//     return this.repository.save(user);
//   }

//   async update(id: number, details: any): Promise<User> {
//     const user = await this.repository.findOneBy({ id });
//     if (user) {
//       return this.repository.save(details);
//     }
//     throw new Error("User was not found..");
//   }

//   async find(condition: any): Promise<User | null> {
//     console.log('condition => ', condition);
//     return this.repository.findOneBy(condition);
//   }

//   async findAll(condition: any): Promise<User[]> {
//     return this.repository.find(condition)
//   }

//   // async findByInfo(condition: any): Promise<User> {
//   //   throw new Error("Method not implemented.");
//   // }
// }
