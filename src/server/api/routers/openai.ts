import { openAIGenerateSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { openai } from "~/utils/openai";

export const openAiRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(openAIGenerateSchema)
    .mutation(async ({ ctx, input }) => {
      const story = await prisma.redditPost.findFirst({
        where: {
          id: input.postId,
          userId: ctx.session.user.id,
        },
      });

      if (!story?.content) return;

      let prompt = `Generate a ${input.type} for this story: ${story.content}.`;

      if (input.type === "tags") {
        prompt += ` Provide a comma-separated list of tags.`;
      }

      if (input.type === "title") {
        prompt = `Generate a title for this story, but keep it short and concise.`;
      }

      if (input.type === "description") {
        prompt = `Generate a description for this story.`;
      }

      const chatRes = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You're a Youtuber assistant. You'll be given a story in the form of long-form text. From which you might be asked to create a title, or a description, or provide some tags. The description should be 1 paragraph for a youtube video description. Tags should be a comma-separated list but don't include them unless you're asked to generate tags.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const result = chatRes.choices[0]?.message?.content?.replace(
        /^['"]|['"]$/g,
        "",
      );

      return {
        result,
        type: input.type,
      };
    }),
});
