// src/router/ProductRoutes.ts
import express, { Router } from 'express';
import { Container } from 'inversify';
import { ProductController } from '../controllers/ProductControllers';
import { INTERFACE_TYPE } from '../utils';
import { IproductRepository } from '../interfaces/IProductRepository';
import { ProductRepository } from '../repositories/productRepository';
import { IMailer } from '../interfaces/IMailer';
import { Mailer } from '../external-libraries/mailer';
import { IMessageBroker } from '../interfaces/IMessageBroker';
import { MessageBroker } from '../external-libraries/messageBroker';
import { IProductInteractor } from '../interfaces/IProductInteractor';
import { ProductInteractor } from './../interactors/productIneractor';

export class ProductRoutes {
  public router: Router;
  private container: Container;
  private controller: ProductController;

  constructor() {
    this.router = express.Router();
    this.container = new Container();
    this.initializeBindings();
    this.controller = this.container.get<ProductController>(INTERFACE_TYPE.ProductController);
    this.initializeRoutes();
  }

  private initializeBindings() {
    this.container
      .bind<IproductRepository>(INTERFACE_TYPE.ProductRepository)
      .to(ProductRepository);
    this.container.bind<IMailer>(INTERFACE_TYPE.Mailer).to(Mailer);
    this.container
      .bind<IMessageBroker>(INTERFACE_TYPE.MessageBroker)
      .to(MessageBroker);
    this.container
      .bind<IProductInteractor>(INTERFACE_TYPE.ProductInteractor)
      .to(ProductInteractor);
    this.container.bind(INTERFACE_TYPE.ProductController).to(ProductController);
  }

  private initializeRoutes() {
    this.router.post('/', (req, res, next) =>
      this.controller.onCreateProduct(req, res, next)
    );

    this.router.get('/', (req, res, next) =>
      this.controller.onGetProducts(req, res, next)
    );

    this.router.patch('/:id', (req, res, next) =>
      this.controller.onUpdateStock(req, res, next)
    );
  }
}
