import { Request } from "express";

export interface CustomRequest extends Request {
  success?: {
    status: number;
    message: string;
    data?: any;
  };
  error?: {
    status: number;
    message: string;
    // error: any;
  };
  user?: any;
}
