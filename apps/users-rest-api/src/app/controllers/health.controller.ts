import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MongodbNativeHealthIndicator } from '../../../../../libs/mongodb-native/src';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly mongodbIndicator: MongodbNativeHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.mongodbIndicator.isHealthy('mongodb')]);
  }
}
