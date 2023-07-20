import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
const configuration = new Configuration({
  apiKey: env.OPEN_AI_KEY,
  organization: env.OPEN_AI_ORG,
});
export const openai = new OpenAIApi(configuration);
