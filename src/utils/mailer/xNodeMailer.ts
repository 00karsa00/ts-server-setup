import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import { logger } from "../logger";
dotenv.config();

export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });
  }

  public async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER as string,
        to,
        subject,
        text,
        html,
      };

      logger.info("Email sent mail: ", to);
      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent: ", info.response);
    } catch (error) {
      logger.error("Error sending email:", `${error}`);
      throw new Error("Failed to send email");
    }
  }
}
