import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { tagOnPostSchema, tagSaveSchema } from "~/server/schemas";

export const tagRouter = createTRPCRouter({
  add: protectedProcedure.input(tagOnPostSchema).mutation(async ({ input }) => {
    return await prisma.tagsOnStories.create({
      data: {
        tagId: input.tagId,
        RedditPostId: input.redditPostId,
      },
    });
  }),
  save: protectedProcedure
    .input(tagSaveSchema)
    .mutation(async ({ ctx, input }) => {
      const tag = await prisma.tag.create({
        data: {
          tag: input.tag,
          userId: ctx.session.user.id,
        },
      });

      if (input.storyId) {
        await prisma.tagsOnStories.create({
          data: {
            RedditPostId: input.storyId,
            tagId: tag.id,
          },
        });
      }
      return;
    }),
  all: protectedProcedure.query(async ({ ctx, input }) => {
    return await prisma.tag.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        TagsOnStories: {
          include: {
            RedditPost: true,
            tag: true,
          },
        },
      },
    });
  }),
});
