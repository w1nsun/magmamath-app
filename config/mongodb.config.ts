import { registerAs } from '@nestjs/config';

export type TMongodbConfig = {
  uri: string;
};

export default registerAs<TMongodbConfig>(
  'mongodb',
  (): TMongodbConfig => ({
    uri: process.env.MONGODB_URI ?? '',
  }),
);
