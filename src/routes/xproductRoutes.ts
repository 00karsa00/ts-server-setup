import express from "express";
import { Container } from "inversify";
import { IproductRepository } from "../interfaces/IProductRepository";
import { ProductRepository } from "../repositories/productRepository";
import { INTERFACE_TYPE } from "../utils/appConst";
import { IMailer } from "../interfaces/IMailer";
import { Mailer } from "../external-libraries/mailer";
import { IMessageBroker } from "../interfaces/IMessageBroker";
import { MessageBroker } from "../external-libraries/messageBroker";
import { IProductInteractor } from "../interfaces/IProductInteractor";
import { ProductInteractor } from "../interactors/productIneractor";
import { ProductController } from "../controllers/ProductControllers";

const container = new Container();
container
  .bind<IproductRepository>(INTERFACE_TYPE.ProductRepository)
  .to(ProductRepository);
container.bind<IMailer>(INTERFACE_TYPE.Mailer).to(Mailer);
container.bind<IMessageBroker>(INTERFACE_TYPE.MessageBroker).to(MessageBroker);
container
  .bind<IProductInteractor>(INTERFACE_TYPE.ProductInteractor)
  .to(ProductInteractor);
container.bind(INTERFACE_TYPE.ProductController).to(ProductController);

const router = express.Router();

const controller = container.get<ProductController>(
  INTERFACE_TYPE.ProductController
);

router.post("/products", controller.onCreateProduct.bind(controller));
router.get("/products", controller.onGetProducts.bind(controller));
router.patch("/products/:id", controller.onUpdateStock.bind(controller));

export default router;
