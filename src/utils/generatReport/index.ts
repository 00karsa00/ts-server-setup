import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";
import { MedicineModel } from "../../entities/medicines";
import moment from "moment";
import { UserModel } from "../../entities/User";
import { MailService } from "../mailer/NodeMailer";

export const generatePaginatedCSV = async () => {
  try {
    console.log("Starting CSV generation...");
    
    const date = moment().format("YYYY-MM-DD");
    const pageSize = 100;
    const fileReport: Record<
      string,
      { filePath: string; csvWriter: any; csvData: any[] }
    > = {};
    let page = 0;
    let hasMoreData = true;

    // Ensure directory exists
    const logDir = path.join(
      __dirname,
      `../../uploads/medicine_report/${date}`
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const header = [
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

    while (hasMoreData) {
      const medicines = await MedicineModel.find()
        .sort({ createdAt: -1, userId: -1 })
        .sort({ createdAt: -1 })
        .skip(page * pageSize)
        .limit(pageSize);

      if (medicines.length === 0) {
        hasMoreData = false;
        break;
      }

      for (const med of medicines) {
        if (!fileReport[med.userId]) {
          const filePath = path.join(logDir, `${med.userId}.csv`);
          fileReport[med.userId] = {
            filePath,
            csvWriter: createObjectCsvWriter({
              path: filePath,
              header,
              append: fs.existsSync(filePath),
            }),
            csvData: [],
          };
        }

        fileReport[med.userId].csvData.push({
          // id: med._id.toString(),
          userId: med.userId,
          name: med.name || "",
          description: med.description || "",
          asDone: med.asDone ? "Yes" : "No",
          type: med.type || "",
          recurringType: med.recurringType || "",
          date: med.date || "",
          time: med.time || "",
          endDate: med.endDate || "",
          day: med.day || "",
        });
      }

      console.log(`Processed batch ${page + 1}`);
      page++;
    }

    // Writing CSV files per user
    for (const userId of Object.keys(fileReport)) {
      await fileReport[userId].csvWriter.writeRecords(
        fileReport[userId].csvData
      );
      console.log(
        `CSV for user ${userId} saved with ${fileReport[userId].csvData.length} records.`
      );
      

      // Fetch user email
      const user = await UserModel.findOne({ userId });
      if (user?.email) {
        // Send email with attachment
        await MailService.getInstance().queueEmail(
          user?.email,
          "Your Medicine Report",
          "Please find attached your medicine report.",
          `<p>Dear ${user?.name},</p><p>Please find attached your medicine report.</p>`,
          fileReport[userId].filePath
        );
      }
    }

    console.log("CSV report generation completed successfully.");
  } catch (error) {
    console.error("Error generating CSV:", error);
  }
};
