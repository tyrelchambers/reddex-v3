import { createClient } from "redis";

export const redisClient = async () => {
  const c = await createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  }).connect();

  c.on("error", (err) => console.log("Redis Client Error", err));

  return c;
};

export const checkCache = async (key: string) => {
  const redis = await redisClient();
  const redisValue = await redis.get(key);

  return redisValue;
};

export const setCache = async (key: string, value: string) => {
  const redis = await redisClient();
  await redis.set(key, value, { EX: 2628000 });
};
