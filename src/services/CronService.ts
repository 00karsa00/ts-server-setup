import { inject, injectable } from "inversify";
import { IMedicineInteractor } from "../interfaces/IMedicine/IMedicineInteractor";
import { MEDICINE_INTERFACE_TYPE } from "../utils/appConst";
import { CronScheduler } from "../utils/cronJob/index";
import { logger } from "../utils/logger";
import moment from "moment";
import CSVReportGenerator from "./CSVReportGenerator";
import { MailService } from "../external-libraries/Mailer";


@injectable()
export class CronService {
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
    this.mailer = MailService.getInstance();

    this.everyMinuteJob = new CronScheduler("*/1 * * * *", async () => {
      try {
        logger.info("Running the every-minute job...");
        await this.runEveryMinute("oneTimeOnly");
        await this.runEveryMinute("recurring");
      } catch (error: any) {
        logger.error("Error in every-minute cron job:", error);
      }
    });
    logger.info("Running weekly report generation...");
    // const csvReportGenerator = new CSVReportGenerator();
    // setTimeout(() =>{
    //   csvReportGenerator.generateReport()

    // }, 5000)
    this.everyWeekReport = new CronScheduler("0 0 * * 1", async () => {
      try {
        logger.info("Running weekly report generation...");
        const csvReportGenerator = new CSVReportGenerator();
        await csvReportGenerator.generateReport()
      } catch (error: any) {
        logger.error("Error in weekly report generation:", error);
      }
    });
  }

  public startJobs(): void {
    logger.info("Starting cron jobs...");
    this.everyMinuteJob.start();
    // this.everyWeekReport.start();
  }

  private async runEveryMinute(type: string): Promise<void> {
    let skip = 0;
    while (true) {
      try {
        const condition = this.buildCondition(type, skip);
        const medications = await this.interactor.getTiggerMedicine(condition);
        if (!medications.length) {
          logger.info(`No more records for type: ${type}. Stopping process.`);
          break;
        }

        for (const med of medications) {
          await this.processMedicineReminder(med);
        }

        skip += this.limit;
      } catch (error: any) {
        logger.error(`Error processing ${type} medications:`, error);
        break;
      }
    }
  }

  private buildCondition(type: string, skip: number) {
    const baseCondition = {
      date: { $lte: moment().toDate() },
      time: {
        $gte: moment().format("hh:mm A"),
        $lt: moment().add(1, "minute").format("hh:mm A"),
      },
      asDone: false,
      skip,
      limit: this.limit,
      type,
    };

    if (type === "recurring") {
      return { ...baseCondition, endDate: { $gte: moment().toDate() } };
    }

    return baseCondition;
  }

  private async processMedicineReminder(med: any) {
    logger.info(`Triggering notification for ${med.name} at ${med.time}`);

    if (
      med.type === "oneTimeOnly" ||
      (med.endDate && moment(med.endDate).isSame(moment(), "day"))
    ) {
      await this.interactor.updateMedicine({ _id: med._id }, { asDone: true });
      await this.mailer.queueEmail(
        med.users[0].email,
        "Medicine status updated",
        "Reminder message",
        `<p>Dear ${med.users[0]?.name},</p>
         <p>${med.name} medicine reminder marked as done on ${med.endDate}</p>`
      );
    }

    const dayOfWeek = moment().format("dddd").toLowerCase();
    if (
      med.type === "oneTimeOnly" ||
      med.recurringType === "daily" ||
      (med.recurringType === "weekly" && dayOfWeek === med.day)
    ) {
      const message = `${med.name} - ${med.description}`;
      await this.mailer.queueEmail(
        med.users[0].email,
        "Reminder for your medicine",
        "Reminder message",
        `<p>Dear ${med.users[0]?.name},</p>
         <p>Please take your medicine:</p>
         <p>${message}</p>`
      );
    }
  }
}
