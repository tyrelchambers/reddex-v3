import { postSchema, responseSchema } from "~/server/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db";
import axios from "axios";
import { COMPOSE_MESSAGE_URL } from "~/url.constants";
import { formatSubject } from "~/utils";
import { refreshAccessToken } from "~/utils/getTokens";
import { captureException } from "@sentry/nextjs";
import { env } from "~/env";
import { PostFromReddit } from "~/types";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { checkCache, setCache } from "~/lib/redis";
import { fetchAiResponse } from "~/utils/openai-helpers";
import { saveInboxMessage } from "~/utils/index.server";

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
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          include: {
            accounts: true,
          },
        });
        const redditAccount = user?.accounts.find(
          (acc) => acc.provider === "reddit",
        );

        if (!redditAccount) return;

        const accessToken = await refreshAccessToken(redditAccount);

        if (env.NODE_ENV !== "production" && !accessToken) {
          throw new Error("Missing access token");
        }

        const body = new FormData();

        const author =
          process.env.NODE_ENV === "production"
            ? input.author
            : "StoriesAfterMidnight";

        body.set("to", author);
        body.set("subject", formatSubject(input.title));
        body.set("text", input.message);

        await axios
          .post(COMPOSE_MESSAGE_URL, body, {
            headers: {
              Authorization: `bearer ${accessToken}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
          .then(async (res) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (!res.data.success) {
              if (res.data instanceof Error) {
                throw new Error(`Failed to send message: ${res.data.message}`);
              }
              console.log(JSON.stringify(res.data));

              throw new Error("Failed to send message");
            }

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

        await saveInboxMessage({
          redditPostId: input.post_id,
          subject: formatSubject(input.title),
          to: author,
          from: ctx.session.user.id,
        });

        return true;
      } catch (error) {
        captureException(error);
        throw error;
      }
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
        deleted_at: null,
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
      }),
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
      return await prisma.redditPost.updateMany({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    }),
  importStory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const url = new URL(input);
        const newUrl = `https://reddit.com${url.pathname}`;

        const storyFromUrl = await axios
          .get(`${newUrl}.json`, {
            headers: {
              "User-Agent": "Reddex/1.0",
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .then((res) => res.data[0].data.children[0].data as PostFromReddit);

        return await prisma.redditPost.create({
          data: {
            content: storyFromUrl.selftext,
            flair: storyFromUrl.link_flair_text ?? undefined,
            userId: ctx.session.user.id,
            permission: true,
            read: false,
            story_length: storyFromUrl.selftext.length,
            post_id: storyFromUrl.id,
            reading_time: Math.round(storyFromUrl.selftext.length / 200),
            author: storyFromUrl.author,
            title: storyFromUrl.title,
            ups: storyFromUrl.ups,
            subreddit: storyFromUrl.subreddit,
            url: storyFromUrl.url,
            upvote_ratio: storyFromUrl.upvote_ratio,
            num_comments: storyFromUrl.num_comments,
            created: storyFromUrl.created_utc,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  removeAllFromCompletedList: protectedProcedure.mutation(async ({ ctx }) => {
    return prisma.redditPost.updateMany({
      where: {
        read: true,
        permission: true,
        userId: ctx.session.user.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }),
  deleteSubmittedStory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return prisma.submittedStory.update({
        where: {
          userId: ctx.session.user.id,
          id: input,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    }),
  readSubmittedStory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return prisma.submittedStory.update({
        where: {
          userId: ctx.session.user.id,
          id: input,
        },
        data: {
          read: true,
        },
      });
    }),
  restoreSubmittedStory: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return prisma.submittedStory.update({
        where: {
          userId: ctx.session.user.id,
          id: input,
        },
        data: {
          read: false,
        },
      });
    }),
  summarize: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `
        Summarize this text: ${input.body}. Return only your summarization and no other preamble.
      `;
      const structure: ChatCompletionMessageParam[] = [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "system",
          content:
            "You are a creative writing genious. Extract the proper information from the prompt. The characters property will be all the characters in the story, including the narrator. The grade is how well written you think the prompt is (which is a story). Take into considering writing style, spelling and grammar mistakes and writing flow. A grade of 1 should be the lowest grade and a grade of 10 is the best. The topics property will be the topics of the story. The summary property will be a summary of the story.",
        },
      ];

      console.log("Checking cache for", input.postId);
      const cacheHit = await checkCache(input.postId);

      if (cacheHit) {
        try {
          console.log("Cache hit");
          await JSON.parse(cacheHit);
          return cacheHit;
        } catch (error) {
          console.log("Cache error");
        }
      }
      console.log("Cache miss -- fetching from OpenAI");

      const resp = await fetchAiResponse(structure, responseSchema);

      if (!resp) {
        console.log("No response from OpenAI", JSON.stringify(resp));
        return;
      }

      console.log("Setting cache for", input.postId);
      await setCache(input.postId, resp);
      console.log("Cache set. Returning response" + JSON.stringify(resp));
      return resp;
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
