import express, { Router } from "express";
import { Container } from "inversify";
import { MEDICINE_INTERFACE_TYPE } from "../utils/appConst";
import { MedicineRepository } from "../repositories/MedicineRepositories";
import { IMedicineRepository } from "../interfaces/IMedicine/IMedicineRepository";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { MedicineInteractor } from "../interactors/MedicineInteractor";
import { MedicinesControllers } from "../controllers/MedicinesControllers";
import { CronControllers } from "../controllers/CronControllers"; // Uncommented
import { validate } from "../interfaces/middleware/requestValidation";
import {
  medicineSchema,
  medicineUpdateSchema,
} from "../interfaces/middleware/requestValidation/medicine";

export class MedicineRoutes {
  public router: Router;
  private container: Container;
  private controller: MedicinesControllers;
  private cronController: CronControllers; // Un-commented

  constructor() {
    this.router = express.Router();
    this.container = new Container();
    this.initializeBindings();
    this.controller = this.container.get<MedicinesControllers>(
      MEDICINE_INTERFACE_TYPE.MedicineController
    );
    this.cronController = new CronControllers(
      this.container.get<IMedicineInteractor>(
        MEDICINE_INTERFACE_TYPE.MedicineInteractor
      )
    ); // Initialize with DI
    this.cronController.init(); // Start cron jobs
    this.initializeRoutes();
  }

  private initializeBindings() {
    this.container
      .bind<IMedicineRepository>(MEDICINE_INTERFACE_TYPE.MedicineRepository)
      .to(MedicineRepository);
    this.container
      .bind<IMedicineInteractor>(MEDICINE_INTERFACE_TYPE.MedicineInteractor)
      .to(MedicineInteractor);
    this.container
      .bind(MEDICINE_INTERFACE_TYPE.MedicineController)
      .to(MedicinesControllers);
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      validate(medicineSchema) as express.RequestHandler,
      (req, res, next) => this.controller.onCreateMedicine(req, res, next)
    );

    this.router.get("/", (req, res, next) =>
      this.controller.onGetAllMedicines(req, res, next)
    );

    this.router.get("/:id", (req, res, next) =>
      this.controller.onGetMedicine(req, res, next)
    );

    this.router.put(
      "/:id",
      validate(medicineUpdateSchema) as express.RequestHandler,
      (req, res, next) => this.controller.onUpdateMedicine(req, res, next)
    );
  }
}
