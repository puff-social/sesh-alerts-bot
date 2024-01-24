import IORedis from 'ioredis';
import { env } from '../env';

export const redis = new IORedis(env.REDIS_URI, { lazyConnect: true });

redis.connect().then(() =>
  console.log(`Redis > Connected to redis at ${redis.options.host}:${redis.options.port} (${redis.options.db})`)
);