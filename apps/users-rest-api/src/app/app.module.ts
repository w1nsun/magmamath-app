import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { DomainModule } from '../domain/domain.module';
import { HealthController } from './controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [DomainModule, TerminusModule],
  controllers: [UsersController, HealthController],
})
export class AppModule {}
