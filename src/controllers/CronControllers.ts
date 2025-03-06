import { inject, injectable } from "inversify";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { MEDICINE_INTERFACE_TYPE } from "../utils/appConst";
import { CronScheduler } from "../utils/cronJob/index";
import { logger } from "./../utils/logger";
import moment from "moment";
import mongoose from "mongoose";
import { MailService } from "../utils/mailer/NodeMailer";
import { generatePaginatedCSV } from "../utils/generatReport";
// import { MailService } from "../utils/mailer/xNodeMailer";
// import { toString } from './../../node_modules/moment/src/lib/moment/format';

@injectable()
export class CronControllers {
  private interactor: IMedicineInteractor;
  private everyMinuteJob: CronScheduler;
  private everyWeekReport: CronScheduler;
  private limit: number = 100;
  private mailer: MailService;

  constructor(
    @inject(MEDICINE_INTERFACE_TYPE.MedicineInteractor)
    interactor: IMedicineInteractor
  ) {
    this.interactor = interactor;
    this.everyMinuteJob = new CronScheduler("*/1 * * * *", () => {
      logger.info("Running the every-minute job...");
      this.runEveryMinute(0, "oneTimeOnly");
      this.runEveryMinute(0, "recurring");
    });
    this.everyWeekReport = new CronScheduler("0 0 * * 1", generatePaginatedCSV);
    // this.everyWeekReport = new CronScheduler("*/1 * * * *", generatePaginatedCSV);
    // this.mailer = new MailService();
    this.mailer = MailService.getInstance();
    // generatePaginatedCSV();
    this.init();
  }

  public async init(): Promise<void> {
    this.everyMinuteJob.start();
    this.everyWeekReport.start();
  }

  private async runEveryMinute(skip: number, type: string): Promise<void> {
    // Fetch medications for the current minute
    let condition: any = {};

    if (type === "oneTimeOnly") {
      condition = {
        date: { $lte: moment().format("YYYY-MM-DD") },
        time: {
          $gte: moment().format("hh:mm A"),
          $lt: moment().add(1, "minute").format("hh:mm A"),
        },
        asDone: false,
        skip,
        limit: this.limit,
        type,
      };
    }

    if (type === "recurring") {
      condition = {
        date: { $lte: moment().format("YYYY-MM-DD") },
        time: {
          $gte: moment().format("hh:mm A"),
          $lt: moment().add(1, "minute").format("hh:mm A"),
        },
        endDate: { $gte: moment().format("YYYY-MM-DD") },
        asDone: false,
        skip,
        limit: this.limit,
        type,
      };
    }
    const dayOfWeek = moment().format("dddd");
    // console.log("dayOfWeek => ", dayOfWeek);
    const medications = await this.interactor.getTiggerMedicine(condition);
    const currentDate = moment().format("YYYY-MM-DD"); // Get today's date
    const customDate = "2025-03-06"; // Example date

    const isLessThanCurrent = moment(customDate, "YYYY-MM-DD").isSame(
      moment(currentDate, "YYYY-MM-DD")
    );

    console.log(isLessThanCurrent); // true if customDate is before today, false otherwise

    if (medications.length === 0) {
      logger.info("No more records. Stopping process.");
      return;
    }

    // const markAsdoneIds = [];

    for (const med of medications) {
      // logger.info(`Triggering notification for ${med.name} at ${med.time}`);
      // console.log("med => ", med);
      console.log("med.users.email => ", med);
      console.log("med.users.email => ", med.users);
      console.log("med.users.email => ", med.users[0].email);
      // Add notification logic here
      if (
        med.type === "oneTimeOnly" ||
        (med.endDate &&
          moment(customDate, "YYYY-MM-DD").isSame(
            moment(currentDate, "YYYY-MM-DD")
          ))
      ) {
        this.interactor.updateMedicine({ _id: med._id }, { asDone: true });
      }
      console.log(
        `${med.type} === oneTimeOnly || ${med.recurringType} === daily ||  (${
          med.recurringType
        } === "weekly" && ${dayOfWeek.toLowerCase()} === ${med.day})`
      );
      if (
        med.type === "oneTimeOnly" ||
        med.recurringType === "daily" ||
        (med.recurringType === "weekly" && dayOfWeek.toLowerCase() === med.day)
      ) {
        // console.log("this condition test ");
        const message = `${med.name} -  ${med.description}`;
        // this.mailer.sendMail(med.users[0].email, "Remaider Maile", message);
        await this.mailer.queueEmail(
          med.users[0].email,
          "Remainder for your medicine",
          `<p>Dear ${med.users[0]?.name},</p>
          <p>Please find your medicine details.</p>
          <p> ${message}</p>`
        );
      }
    }

    // Recursively processs the next batch
    setTimeout(() => this.runEveryMinute(skip + this.limit, type), 1000);
  }
}
