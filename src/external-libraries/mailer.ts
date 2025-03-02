import { injectable } from "inversify";
import { IMailer } from "../interfaces/IMailer";

@injectable()
export class Mailer implements IMailer {
    SendEmail(to: string, product: unknown): void {
        console.log(`Sending email to ${to} about ${product}`);
    }
}