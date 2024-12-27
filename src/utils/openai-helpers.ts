import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { openai } from "~/lib/openai";
import { redisClient } from "~/lib/redis";

export const checkCache = async (key: string) => {
  const redis = await redisClient();
  const redisValue = await redis.get(key);

  return redisValue;
};

export const setCache = async (key: string, value: string) => {
  const redis = await redisClient();
  await redis.set(key, value);
};

export const fetchAiResponse = async (
  structure: ChatCompletionMessageParam[],
) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "developer",
        content: "You are a helpful assistant.",
      },
      ...structure,
    ],
  });
  return response?.choices?.[0]?.message.content ?? null;
};
