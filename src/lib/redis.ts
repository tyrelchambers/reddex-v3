import { createClient } from "redis";

export const redisClient = async () => {
  const c = await createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  }).connect();

  return c;
};

export const checkCache = async (key: string) => {
  const redis = await redisClient();
  const redisValue = await redis.get(key);

  return redisValue;
};

export const setCache = async (key: string, value: string) => {
  const redis = await redisClient();
  await redis.set(key, value);
};
