import { MAX_RETRIES, RETRY_INTERVAL_MS } from '@/configs/constants';
import { RegisterConfigs } from '@/configs/register';
import { createClient } from 'redis';

const { REDIS_ENDPOINT_HOST, REDIS_ENDPOINT_PORT, REDIS_PASSWORD } = RegisterConfigs;

export type RedisClientType = ReturnType<typeof createClient>;

let redisClient: RedisClientType;

export function createRedisClient() {
  if (redisClient) {
    return Promise.resolve(redisClient);
  } else {
    return new Promise<RedisClientType>((resolve, reject) => {
      let retries = 0;

      const connect = () => {
        redisClient = createClient({
          password: REDIS_PASSWORD,
          socket: {
            host: REDIS_ENDPOINT_HOST,
            port: REDIS_ENDPOINT_PORT,
          },
        });

        redisClient.once('ready', () => resolve(redisClient));

        redisClient.once('error', (error) => {
          console.error('Redis connection error:', error);
          retries++;

          if (retries < MAX_RETRIES) {
            console.log(`Retrying connection in ${RETRY_INTERVAL_MS}ms...`);
            setTimeout(connect, RETRY_INTERVAL_MS);
          } else {
            reject(new Error('Failed to connect to Redis'));
          }
        });

        redisClient.connect();
      };

      connect();
    });
  }
}
