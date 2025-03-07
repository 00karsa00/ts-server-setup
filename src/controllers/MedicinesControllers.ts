import { NextFunction, Request, Response } from "express";
import { inject } from "inversify";
import { MEDICINE_INTERFACE_TYPE } from "../utils/appConst";
import { CustomRequest } from "../type.config/custom";
import { CustomError } from "../utils/error";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { MailService } from "../external-libraries/Mailer";

export class MedicinesControllers {
  private interactor: IMedicineInteractor;
  private mailer: MailService;

  constructor(
    @inject(MEDICINE_INTERFACE_TYPE.MedicineInteractor)
    interactor: IMedicineInteractor
  ) {
    this.interactor = interactor;
    this.mailer = MailService.getInstance();
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
      const message = `
        Name: ${name},
        Description: ${description},
        Remainder Type: ${type},
        Recurring Type: ${recurringType || "-"},
        Time: ${time},
        End Date: ${endDate || "-"},
        Day: ${day || "-"}
        `;
      await this.mailer.queueEmail(
        req.user.email,
        "New medition added",
        'New medition was added',
        `<p>Dear ${req.user.name},</p>
        <p>New medition was added..</p>
        <p>${message}</p>`
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
      const { userId } = req.user;
      const medicines = await this.interactor.getAllMedicine({ userId });
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

  async onMedicineStatus(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const medicine = await this.interactor.updateMedicine(
        { _id: id, userId },
        {
          asDone: true,
        }
      );
      
      await this.mailer.queueEmail(
        req.user.email,
        "Medicine status updated ",
        "Status updated",
        `<p>Dear ${req.user.name},</p>
        <p>${medicine?.name} medicine reaimder as done</p>`
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
