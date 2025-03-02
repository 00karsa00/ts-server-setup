import { injectable } from 'inversify';
import { IMessageBroker } from './../interfaces/IMessageBroker';

@injectable()
export class MessageBroker implements IMessageBroker {  
    NotifyToPromotionService(product: unknown): void {
        console.log(`Notifying promotion service about ${product}`);
    }
}