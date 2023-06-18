import { postSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const storyRouter = createTRPCRouter({
  getApprovedList: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  getCompletedList: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
        permission: true,
        read: true,
      },
    });
  }),
  addToApproved: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const foundPost = await prisma.redditPost.findFirst({
        where: {
          id: input,
        },
      });

      if (foundPost == null) {
        return {
          success: false,
          message: "Post not found. Unable to add to approved list.",
        };
      } else {
        return await prisma.redditPost.updateMany({
          where: {
            id: input,
            userId: ctx.session.user.id,
          },
          data: {
            permission: true,
            read: false,
          },
        });
      }
    }),
  addToCompleted: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await prisma.redditPost.updateMany({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        data: {
          read: true,
          permission: true,
        },
      });
    }),
  save: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      await prisma.redditPost.create({
        data: {
          ...input,
          flair: input.flair != null ? input.flair : undefined,
          userId: ctx.session.user.id,
        },
      });

      await prisma.contactedWriters.create({
        data: {
          name: input.author,
          userId: ctx.session.user.id,
        },
      });

      return true;
    }),
  getUsedPostIds: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        post_id: true,
      },
    });
  }),
  submittedList: protectedProcedure.query(async ({ ctx, input }) => {
    return await prisma.submittedStory.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  storyById: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!input) return;
      return await prisma.submittedStory.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),

  completeStory: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.submittedStory.updateMany({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          completed: input.completed,
        },
      });
    }),
});
