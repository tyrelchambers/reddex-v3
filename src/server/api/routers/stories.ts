import { postSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import axios from "axios";
import { COMPOSE_MESSAGE_URL } from "~/url.constants";
import { formatSubject } from "~/utils/formatSubject";
import { refreshAccessToken } from "~/utils/refreshAccessToken";

export const storyRouter = createTRPCRouter({
  getApprovedList: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
        permission: true,
        read: false,
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
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          accounts: true,
        },
      });
      const redditAccount = user?.accounts.find(
        (acc) => acc.provider === "reddit"
      );

      if (!redditAccount) return;

      const accessToken = await refreshAccessToken(redditAccount);
      // env.NODE_ENV === "production" &&
      if (accessToken) {
        const body = new FormData();
        // body.set("to", input.author);
        body.set("to", "StoriesAfterMidnight");
        body.set("subject", formatSubject(input.title));
        body.set("text", input.message);

        await axios
          .post(COMPOSE_MESSAGE_URL, body, {
            headers: {
              Authorization: `bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then(async () => {
            const { message, ...rest } = input;
            await prisma.redditPost.create({
              data: {
                ...rest,
                flair: input.flair ?? undefined,
                userId: ctx.session.user.id,
              },
            });

            await prisma.contactedWriters.create({
              data: {
                name: input.author,
                userId: ctx.session.user.id,
              },
            });
          });
      }

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
  submittedList: protectedProcedure.query(async ({ ctx }) => {
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
  postById: protectedProcedure
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      return await prisma.redditPost
        .findMany({
          where: {
            id: input,
            userId: ctx.session.user.id,
          },
        })
        .then((res) => res[0]);
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
  deleteStory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await prisma.redditPost.deleteMany({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
