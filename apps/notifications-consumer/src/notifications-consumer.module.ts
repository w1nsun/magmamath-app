import { Module } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { AppLoggerModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    AppLoggerModule,
    AppModule,
  ],
})
export class NotificationsConsumerModule {}
