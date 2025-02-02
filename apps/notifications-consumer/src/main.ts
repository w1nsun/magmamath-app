import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsConsumerModule } from './notifications-consumer.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsConsumerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'notifications',
          brokers: process.env.KAFKA_BROKER_ADDRESS?.split(',') ?? [],
        },
        consumer: {
          groupId: 'notifications-consumer',
          allowAutoTopicCreation: false,
        },
        subscribe: {
          fromBeginning: true,
        },
      },
    },
  );

  app.useLogger(app.get(Logger));

  await app.listen();
}
bootstrap();
