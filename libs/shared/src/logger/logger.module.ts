import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        quietReqLogger: true,
        quietResLogger: true,
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
        genReqId: function (req, res) {
          const existingID = req.id ?? req.headers['x-request-id'];
          if (existingID) {
            return existingID;
          }

          const id = randomUUID();
          res.setHeader('X-Request-Id', id);

          return id;
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class AppLoggerModule {}
