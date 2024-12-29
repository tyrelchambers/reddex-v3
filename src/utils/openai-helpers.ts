import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from "zod";
import { openai } from "~/lib/openai";
import { zodResponseFormat } from "openai/helpers/zod";

const responseSchema = z.object({
  characters: z.array(z.string()),
  summary: z.string(),
  grade: z.number(),
  topics: z.array(z.string()),
});

export type AiResponse = z.infer<typeof responseSchema>;

export const fetchAiResponse = async (
  structure: ChatCompletionMessageParam[],
) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini-2024-07-18",
    messages: [
      {
        role: "system",
        content:
          "You are a creative writing genious. Extract the proper information from the prompt. The characters property will be all the characters in the story, including the narrator. The grade is how well written you think the prompt is (which is a story). Take into considering writing style, spelling and grammar mistakes and writing flow. A grade of 1 should be the lowest grade and a grade of 10 is the best. The topics property will be the topics of the story. The summary property will be a summary of the story.",
      },
      ...structure,
    ],
    response_format: zodResponseFormat(responseSchema, "output"),
  });

  return response?.choices?.[0]?.message.content ?? null;
};
