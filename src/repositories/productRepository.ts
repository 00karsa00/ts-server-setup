import { injectable } from "inversify";
import { Product } from "../entities/Product";
import { IproductRepository } from "../interfaces/IProductRepository";

@injectable()
export class ProductRepository implements IproductRepository{

    constructor() {
    }
    
    create(data: Product): any {
        return { id: 1, name: "test", stock: 1, function: 'create'};
    }
    update(id: number, stock: number): any {
        return { id: 1, name: "test", stock: 1, function: 'create'};
    }
    find(limit: number, offset: number): any {
        return { id: 1, name: "test", stock: 1, function: 'create'};
    }
    
}