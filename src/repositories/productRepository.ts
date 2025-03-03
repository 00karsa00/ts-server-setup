import { injectable } from "inversify";
import { IproductRepository } from "../interfaces/IProductRepository";
import { Product } from "../entities/Product";
import { EqualOperator, Repository, ReturnDocument } from "typeorm";
import { AppDataSource } from "../config/database/typeOrm";

@injectable()
export class ProductRepository implements IproductRepository {
  private repository: Repository<Product>;
  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async create(data: Product): Promise<any> {
    return this.repository.save(data);
  }

  async update(id: number, stock: number): Promise<Product> {
    const product = await this.repository.findOneBy({ id });
    if (product) {
      product.stock = stock;
      return this.repository.save(product);
    }
    throw new Error("Product not found..");
  }

  find(limit: number, offset: number): any {
    return this.repository.find({
      take: limit,
      skip: offset,
    });
  }
}
