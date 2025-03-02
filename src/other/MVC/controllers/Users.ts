import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/Users";
// import { UserService } from "../application/UserService"; 

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      // const user = await this.userService.createUser({name, email, password, role});
      // res.status(201).json(user);
      res.status(201).json({});
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  public async getUsers(req: Request, res: Response) {
    try {
      // const users = await this.userService.getUsers();
      res.status(200).json({
        message: "Users fetched successfully",
        // users,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  }
}
