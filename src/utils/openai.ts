import { } from "openai";
import { env } from "~/env.mjs";
import OpenAI from 'openai';

const configuration = {
  apiKey: env.OPEN_AI_KEY,
  organization: env.OPEN_AI_ORG,
}
export const openai = new OpenAI(configuration);
