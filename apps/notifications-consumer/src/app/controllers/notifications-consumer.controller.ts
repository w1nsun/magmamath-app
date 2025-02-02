import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService, TIncomingUserEvent } from '../../domain/notifications';
import { PinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

@Controller()
export class NotificationsConsumerController {
  constructor(
    private readonly notificationService: NotificationsService,
    private readonly logger: PinoLogger,
  ) {}

  @MessagePattern('user.events.v1')
  handleNotification(@Payload() eventData: TIncomingUserEvent, @Ctx() context: KafkaContext) {
    const logger = this.loggerWithContext(context);
    this.notificationService.sendNotification(eventData, logger);
  }

  /**
   * Stub for Logger, context only works for http service(middleware):
   * https://github.com/nestjs/nest/issues/1627
   * https://github.com/iamolegga/nestjs-pino/issues/803
   */
  private loggerWithContext(context: KafkaContext): Logger {
    const originalMessage = context.getMessage();
    const { headers } = originalMessage;
    const reqId = headers ? (headers['x-req-id'] as string) : undefined;

    return this.logger.logger.child({
      reqId,
    });
  }
}
