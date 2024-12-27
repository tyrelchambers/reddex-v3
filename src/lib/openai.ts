import OpenAI from "openai";

export const openai = new OpenAI({
  organization: "org-TWEpNTvGGPbaekqRouVtks6D",
  project: "proj_FH4Q3fXZIVcEP86GCHNBPTtb",
  apiKey: process.env.AI_API_KEY,
});
