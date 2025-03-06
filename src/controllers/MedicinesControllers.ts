import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { MEDICINE_INTERFACE_TYPE } from "../utils/appConst";
import { CustomRequest } from "../type.config/custom";
import { CustomError } from "../utils/error";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { MailService } from "../utils/mailer/xNodeMailer";

export class MedicinesControllers {
  private interactor: IMedicineInteractor;
  private mailer: MailService;

  constructor(
    @inject(MEDICINE_INTERFACE_TYPE.MedicineInteractor)
    interactor: IMedicineInteractor
  ) {
    this.interactor = interactor;
    this.mailer = new MailService();
  }

  async onCreateMedicine(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        name,
        description,
        asDone = false,
        type,
        recurringType,
        date,
        time,
        endDate,
        day,
      } = req.body;
      const medicine = await this.interactor.createMedicine({
        userId: req.user.userId,
        name,
        description,
        asDone,
        type,
        recurringType,
        date,
        time,
        endDate,
        day,
      });
      await this.mailer.sendMail(
        "karthiskam@gmail.com",
        "Send Mailer",
        "Test Test "
      );
      req.success = {
        status: 201,
        message: "Medicine added Successfully",
        data: { medicine },
      };
    } catch (error) {
      console.log("error => ", error);
      if (error instanceof CustomError) {
        req.error = { status: error.status, message: error.message };
      } else {
        req.error = { status: 500, message: "Server error!!" };
      }
    } finally {
      next();
    }
  }

  async onGetAllMedicines(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const medicines = await this.interactor.getAllMedicine({});
      req.success = {
        status: 201,
        message: "Get All Medicines Successfully",
        data: { medicines },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }

  async onGetMedicine(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medicine = await this.interactor.getMedicine({ _id: id });
      if (!medicine) {
        req.success = {
          status: 401,
          message: "medicine info was not found",
        };
        return next();
      }
      req.success = {
        status: 201,
        message: "Get All Users Successfully",
        data: { user: medicine },
      };
      return next();
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
      return next();
    }
  }

  async onUpdateMedicine(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        asDone,
        type,
        recurringType,
        date,
        time,
        endDate,
        day,
      } = req.body;
      const { userId } = req.user;
      const medicine = await this.interactor.updateMedicine(
        { _id: id, userId },
        {
          name,
          description,
          asDone,
          type,
          recurringType,
          date,
          time,
          endDate,
          day,
        }
      );
      req.success = {
        status: 201,
        message: "Updated the medicine Info..",
        data: { medicine },
      };
    } catch (error) {
      req.error = { status: 500, message: "Server Error!" };
    } finally {
      next();
    }
  }
}
