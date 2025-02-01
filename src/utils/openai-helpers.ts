import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { openai } from "~/lib/openai";
import { zodResponseFormat } from "openai/helpers/zod";

export async function* fetchAiResponse(
  structure: ChatCompletionMessageParam[],
  schema?: z.ZodTypeAny,
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [...structure],
    ...(schema && {
      response_format: zodResponseFormat(schema, "output"),
    }),
    stream: true,
  });
  console.log(response);

  for await (const chunk of response) {
    if (!chunk || chunk?.choices?.[0]?.finish_reason === "stop") {
      break;
    }
    const text = chunk.choices[0]?.delta?.content || "";

    console.log("text -> ", text);

    if (text) {
      yield text;
    }
  }
}
