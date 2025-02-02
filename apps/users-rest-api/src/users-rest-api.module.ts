import { MongodbNativeModule } from '@app/mongodb-native';
import { AppLoggerModule } from '@app/shared';
import kafkaConfig from '@config/kafka.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    AppLoggerModule,
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          imports: [ConfigModule.forFeature(kafkaConfig)],
          inject: [kafkaConfig.KEY],
          name: 'KAFKA_USERS_CLIENT',
          useFactory: (config: ConfigType<typeof kafkaConfig>) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'users',
                brokers: config.brokers,
              },
              producerOnlyMode: true,
              producer: {
                allowAutoTopicCreation: false,
              },
            },
          }),
        },
      ],
    }),
    MongodbNativeModule,
    AppModule,
  ],
})
export class UsersRestApiModule {}
