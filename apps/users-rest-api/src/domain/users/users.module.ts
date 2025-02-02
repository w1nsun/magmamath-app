import { Module, OnModuleInit } from '@nestjs/common';
import { UserRepository, USERS_COLLECTION } from './repositories/user.repository';
import { UsersService } from './users.service';
import { Kafka } from 'kafkajs';
import { USER_EVENTS_TOPIC } from './constants';
import { MongoClient } from 'mongodb';
import { PinoLogger } from 'nestjs-pino';

@Module({
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly mongoClient: MongoClient,
    private readonly logger: PinoLogger,
  ) {}

  async onModuleInit() {
    try {
      await this.mongoClient.db().createCollection(USERS_COLLECTION);
      await this.mongoClient
        .db()
        .collection(USERS_COLLECTION)
        .createIndex({ email: 1 }, { unique: true });
    } catch (error) {
      this.logger.error(error);
    }

    const kafka = new Kafka({
      clientId: 'users-client',
      brokers: process.env.KAFKA_BROKER_ADDRESS?.split(',') ?? [],
    });
    const admin = kafka.admin();
    const topics = await admin.listTopics();

    const topicList: any[] = [];

    if (!topics.includes(USER_EVENTS_TOPIC)) {
      topicList.push({
        topic: USER_EVENTS_TOPIC,
        numPartitions: 2,
        replicationFactor: 1,
      });
    }

    if (topicList.length) {
      await admin.createTopics({
        topics: topicList,
      });
    }
  }
}
