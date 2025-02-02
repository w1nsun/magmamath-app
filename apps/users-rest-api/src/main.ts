import { NestFactory } from '@nestjs/core';
import { UsersRestApiModule } from './users-rest-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(UsersRestApiModule, { cors: true });

  app.useLogger(app.get(Logger));

  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Users Rest API')
    .setDescription('The REST API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
