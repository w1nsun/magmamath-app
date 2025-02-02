import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongodbNativeHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly mongoClient: MongoClient,
  ) {}

  async isHealthy(key: string) {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.mongoClient.db().admin().ping();
    } catch {
      return indicator.down();
    }

    return indicator.up();
  }
}
