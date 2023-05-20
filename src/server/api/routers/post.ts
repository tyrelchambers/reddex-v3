import { postSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";

export const postRouter = createTRPCRouter({
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
      return await prisma.redditPost.create({
        data: {
          ...input,
          flair: input.flair != null ? input.flair : undefined,
          userId: ctx.session.user.id,
        },
      });
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
});
