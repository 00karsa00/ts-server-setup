import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import moment from "moment";
import { MedicineModel } from "../entities/medicines";
import { UserModel } from "../entities/User";
import { MailService } from "../external-libraries/Mailer";
import { logger } from "../utils/logger";
import { injectable } from "inversify";

@injectable()
class CSVReportGenerator {
  private pageSize = 100;
  private fileReport: Record<
    string,
    { filePath: string; csvWriter: any; csvData: any[] }
  > = {};
  private logDir: string;

  constructor() {
    const date = moment().format("YYYY-MM-DD");
    this.logDir = path.join(__dirname, `../../uploads/medicine_report/${date}`);
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public async generateReport(): Promise<void> {
    try {
      logger.info("Starting weekly CSV generation...");
      const lastWeek = moment().subtract(7, "days").startOf("day").toDate();
      const today = moment().endOf("day").toDate();
      let page = 0;
      let hasMoreData = true;

      while (hasMoreData) {
        console.log('this will tigger')
        hasMoreData = await this.processBatch(page, lastWeek, today);
        logger.info(`Processed batch ${page + 1}`);
        page++;
      }

      await this.writeAndSendReports();
      logger.info("Weekly CSV report generation completed successfully.");
    } catch (error: any) {
      logger.error("Error generating CSV:", error);
    }
  }

  private async processBatch(
    page: number,
    lastWeek: Date,
    today: Date
  ): Promise<boolean> {


    // Define the date range
    const startDate = new Date(lastWeek); // Replace with your start date
    const endDate = new Date(today); // Replace with your end date
    const aggregationPipeline: any[] = [
      {
        $match: {
          $or: [
            { date: { $gte: startDate, $lte: endDate } },
            { endDate: { $gte: startDate, $lte: endDate } },
          ],
        },
      },
    ];
    console.log('aggregationPipeline => ', JSON.stringify(aggregationPipeline))
    const medicines = await MedicineModel.aggregate(aggregationPipeline)
      .sort({ userId: -1 })
      .skip(page * this.pageSize)
      .limit(this.pageSize);

     console.log('aggregationPipeline => ', medicines)

    if (medicines.length === 0) return false;

    for (const med of medicines) {
      if (!this.fileReport[med.userId]) {
        const filePath = path.join(this.logDir, `${med.userId}.csv`);
        this.fileReport[med.userId] = {
          filePath,
          csvWriter: createObjectCsvWriter({
            path: filePath,
            header: this.getCSVHeaders(),
            append: fs.existsSync(filePath),
          }),
          csvData: [],
        };
      }
      this.fileReport[med.userId].csvData.push(this.mapMedicineData(med));
    }
    return true;
  }

  private async writeAndSendReports(): Promise<void> {
    for (const userId of Object.keys(this.fileReport)) {
      await this.fileReport[userId].csvWriter.writeRecords(
        this.fileReport[userId].csvData
      );
      logger.info(
        `CSV for user ${userId} saved with ${this.fileReport[userId].csvData.length} records.`
      );
      await this.sendEmailReport(userId, this.fileReport[userId].filePath);
    }
  }

  private async sendEmailReport(
    userId: string,
    filePath: string
  ): Promise<void> {
    const user = await UserModel.findOne({ _id: userId });
    if (user?.email) {
      await MailService.getInstance().queueEmail(
        user.email,
        "Your Medicine Report",
        "Please find attached your medicine report.",
        `<p>Dear ${user.name},</p><p>Please find attached your medicine report.</p>`,
        filePath
      );
    }
  }

  private getCSVHeaders() {
    return [
      { id: "id", title: "Id" },
      { id: "userId", title: "User ID" },
      { id: "name", title: "Name" },
      { id: "description", title: "Description" },
      { id: "asDone", title: "As Done" },
      { id: "type", title: "Type" },
      { id: "recurringType", title: "Recurring Type" },
      { id: "date", title: "Date" },
      { id: "time", title: "Time" },
      { id: "endDate", title: "End Date" },
      { id: "day", title: "Day" },
    ];
  }

  private mapMedicineData(med: any) {
    return {
      id: med._id.toString(),
      userId: med.userId,
      name: med.name || "",
      description: med.description || "",
      asDone: med.asDone ? "Yes" : "No",
      type: med.type || "",
      recurringType: med.recurringType || "",
      date: med.date ? moment(med.date).format("YYYY-MM-DD") : "",
      time: med.time || "",
      endDate: med.endDate ? moment(med.endDate).format("YYYY-MM-DD") : "",
      day: med.type === "recurring" ? med.day || "" : "",
    };
  }
}

export default CSVReportGenerator;
