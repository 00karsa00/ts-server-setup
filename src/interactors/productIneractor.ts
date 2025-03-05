import { inject, injectable } from "inversify";
import { IMailer } from "../interfaces/IMailer";
import { IMessageBroker } from "../interfaces/IMessageBroker";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { IproductRepository } from "../interfaces/IProductRepository";
import { INTERFACE_TYPE } from "../utils/appConst";

@injectable()
export class ProductInteractor implements IProductInteractor {
  private repository: IproductRepository;
  private mailer: IMailer;
  private broker: IMessageBroker;

  constructor(
    @inject(INTERFACE_TYPE.ProductRepository) repository: IproductRepository,
    @inject(INTERFACE_TYPE.Mailer) mailer: IMailer,
    @inject(INTERFACE_TYPE.MessageBroker) broker: IMessageBroker
  ) {
    this.repository = repository;
    this.mailer = mailer;
    this.broker = broker;
  }

  async createProduct(details: any): Promise<any> {
    return this.repository.create(details);
  }

  async updateProduct(id: number, stock: number): Promise<any> {
    return this.repository.update(id, stock);
  }

  async getProducts(limit: number, offset: number): Promise<any> {
    return this.repository.find(limit, offset);
  }
}
