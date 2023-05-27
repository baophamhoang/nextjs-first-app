import { MAX_RETRIES, RETRY_INTERVAL_MS } from "@/configs/constants";
import { createClient } from "redis";

export type RedisClientType = ReturnType<typeof createClient>

export function createRedisClient() {
  return new Promise<RedisClientType>((resolve, reject) => {
    let retries = 0;

    const connect = () => {
      const redisClient = createClient();

      redisClient.once('ready', () => {
        resolve(redisClient);
      });

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