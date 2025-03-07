import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { Worker } from "bullmq";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";
import { mailQueue } from "../utils/bullmq";

dotenv.config();

export class MailService {
  private static instance: MailService;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    // Start a BullMQ worker to process email jobs
    this.initWorker();
  }

  public static getInstance(): MailService {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  private initWorker() {
    const worker = new Worker(
      "mailQueue",
      async (job) => {
        try {
          const { to, subject, text, html, attachmentPath } = job.data;
          await this.sendMail(to, subject, text, html, attachmentPath);
          logger.info(`Email sent successfully to ${to}`);
        } catch (error) {
          logger.error(`Error processing email job: ${error}`);
          throw error; // Allow BullMQ to handle retries if configured
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: Number(process.env.REDIS_PORT) || 6379,
        },
      }
    );

    worker.on("failed", (job: any, err) => {
      logger.error(`Job failed: ${job.id}, Reason: ${err.message}`);
    });

    logger.info("BullMQ Worker started for email processing.");
  }

  public async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachmentPath?: string
  ): Promise<void> {
    try {
      const mailOptions: any = {
        from: process.env.SMTP_USER as string, // Ensuring consistency
        to,
        subject,
        text,
        html,
      };

      // Verify attachment existence
      if (attachmentPath) {
        if (fs.existsSync(attachmentPath)) {
          logger.info(`Attachment found: ${attachmentPath}`);
          mailOptions.attachments = [
            {
              filename: path.basename(attachmentPath),
              path: attachmentPath,
            },
          ];
        } else {
          logger.warn(`Attachment not found: ${attachmentPath}`);
        }
      }

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.response}`);
    } catch (error) {
      logger.error(`Error sending email: ${error}`);
      throw new Error("Failed to send email");
    }
  }

  public async queueEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
    attachmentPath?: string
  ) {
    await mailQueue.add("sendMail", {
      to,
      subject,
      text,
      html,
      attachmentPath,
    });

    logger.info(`Email queued: ${to}`);
  }
}
