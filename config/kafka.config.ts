import { registerAs } from '@nestjs/config';

export type TKafkaConfig = {
  brokers: string[];
};

export default registerAs<TKafkaConfig>('kafka', (): TKafkaConfig => {
  const brokers = process.env.KAFKA_BROKER_ADDRESS?.split(',') ?? [];

  return {
    brokers,
  };
});
