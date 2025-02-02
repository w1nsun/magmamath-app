import { Module } from '@nestjs/common';
import { NotificationsConsumerController } from './controllers/notifications-consumer.controller';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [DomainModule],
  controllers: [NotificationsConsumerController],
})
export class AppModule {}
