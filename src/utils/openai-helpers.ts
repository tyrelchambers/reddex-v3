import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { openai } from "~/lib/openai";
import { zodResponseFormat } from "openai/helpers/zod";

export async function fetchAiResponse(
  structure: ChatCompletionMessageParam[],
  schema?: z.ZodTypeAny,
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [...structure],
    ...(schema && {
      response_format: zodResponseFormat(schema, "output"),
    }),
  });

  return response.choices[0]?.message.content;
}
