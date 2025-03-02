import { NextFunction, Request, Response } from "express";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class ProductController {
  private interactor: IProductInteractor;

  constructor(
    @inject(INTERFACE_TYPE.ProductInteractor) interactor: IProductInteractor) {
    this.interactor = interactor;
  }

  async onCreateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.interactor.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async onGetProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 0;

      const products = await this.interactor.getProducts(limit, offset);
      res.status(200).json({message: "success", data: {}});
    } catch (error) {
      next(error);
    }
  }
  async onUpdateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const stock = req.body.stock;

      const product = await this.interactor.updateProduct(id, stock);
      res.status(200).json(product);
    } catch (error) {
      next(error)
    }
  }
}
