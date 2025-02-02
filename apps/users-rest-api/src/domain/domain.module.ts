import { Module } from '@nestjs/common';
import { UsersModule } from './users';

@Module({
  imports: [UsersModule],
  exports: [UsersModule],
})
export class DomainModule {}
