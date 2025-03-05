import { NextFunction, Response } from "express";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils/appConst";
import { CustomRequest } from "../type.config/custom";

@injectable()
export class ProductController {
  private interactor: IProductInteractor;

  constructor(
    @inject(INTERFACE_TYPE.ProductInteractor) interactor: IProductInteractor
  ) {
    this.interactor = interactor;
  }

  async onCreateProduct(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const product = await this.interactor.createProduct(req.body);
      req.success = {
        status: 201,
        message: "Product created",
        data: { product },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }

  async onGetProducts(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const offset = Number(req.query.offset) || 0;
      const limit = Number(req.query.limit) || 0;
      const products = await this.interactor.getProducts(limit, offset);
      req.success = {
        status: 201,
        message: "success",
        data: { products },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }

  async onUpdateStock(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const stock = req.body.stock;
      const product = await this.interactor.updateProduct(id, stock);
      req.success = {
        status: 201,
        message: "success",
        data: { product },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }
}
