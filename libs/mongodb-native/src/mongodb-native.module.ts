import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import mongodbConfig from '@config/mongodb.config';
import { MongodbNativeHealthIndicator } from './mongodb-native.health';
import { TerminusModule } from '@nestjs/terminus';

@Global()
@Module({
  imports: [ConfigModule.forFeature(mongodbConfig), TerminusModule],
  providers: [
    {
      provide: MongoClient,
      useFactory: async (config: ConfigType<typeof mongodbConfig>) => {
        const client = new MongoClient(config.uri);

        await client.connect();

        return client;
      },
      inject: [mongodbConfig.KEY],
    },
    MongodbNativeHealthIndicator,
  ],
  exports: [MongoClient, MongodbNativeHealthIndicator],
})
export class MongodbNativeModule {}
