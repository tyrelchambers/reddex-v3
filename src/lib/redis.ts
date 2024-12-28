import { createClient } from "redis";

export const redisClient = async () => {
  const c = await createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  }).connect();

  return c;
};
