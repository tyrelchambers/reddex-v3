import { createClient } from "redis";

export const redisClient = async () => {
  const c = await createClient().connect();

  return c;
};
