import { Injectable } from '@nestjs/common';
import { Logger } from 'pino';
import { TIncomingUserEvent, USER_CREATED_EVENT, USER_DELETED_EVENT } from './dtos/incoming.dto';

@Injectable()
export class NotificationsService {
  constructor() {}

  sendNotification(event: TIncomingUserEvent, logger: Logger) {
    switch (event.event) {
      case USER_CREATED_EVENT:
        logger.info(`Welcome, ${event.data.name}! 🎉 We're excited to have you here!`);
        break;
      case USER_DELETED_EVENT:
        logger.info(`Goodbye, ${event.data.name}! 💔 We're sad to see you go!`);
        break;
    }
  }
}
