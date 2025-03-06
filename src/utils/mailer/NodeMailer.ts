import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { logger } from "../logger";
import { mailQueue } from "../bullmq/index"; // Import BullMQ queue
import { Worker } from "bullmq";
import fs from "fs";
import path from "path";

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
    new Worker(
      "mailQueue",
      async (job) => {
        const { to, subject, text, html, attachmentPath } = job.data;
        await this.sendMail(to, subject, text, html, attachmentPath);
      },
      {
        connection: {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: Number(process.env.REDIS_PORT) || 6379,
        },
      }
    );

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
        from: process.env.EMAIL_USER as string,
        to,
        subject,
        text,
        html,
      };
      console.log('attachmentPath  && => ', attachmentPath);
      console.log('fs.existsSync(attachmentPath)  && => ', attachmentPath ? fs.existsSync(attachmentPath) : false);
      if (attachmentPath && fs.existsSync(attachmentPath)) {
        mailOptions.attachments = [
          {
            filename: path.basename(attachmentPath),
            path: attachmentPath,
          },
        ];
      }

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent: ", info.response);
    } catch (error) {
      logger.error("Error sending email:", `${error}`);
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
    console.log('attachmentPath => ',attachmentPath)
    logger.info(`Email queued: ${to}`);
  }
}
