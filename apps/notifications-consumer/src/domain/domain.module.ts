import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications';

@Module({
  imports: [NotificationsModule],
  exports: [NotificationsModule],
})
export class DomainModule {}
