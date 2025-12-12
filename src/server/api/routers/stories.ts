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
import { PostFromReddit, RedditComposeResponse } from "~/types";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { checkCache, setCache } from "~/lib/redis";
import { fetchAiResponse } from "~/utils/openai-helpers";
import { saveInboxMessage } from "~/utils/index.server";
import queryString from "query-string";

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

        const body = {
          to:
            process.env.NODE_ENV === "production"
              ? input.author
              : "StoriesAfterMidnight",
          subject: formatSubject(input.title),
          text: input.message,
        };

        await axios
          .post(COMPOSE_MESSAGE_URL, queryString.stringify(body), {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then(async (res: RedditComposeResponse) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

            if (res.data.json.errors.length > 0) {
              const dataStr = JSON.stringify(res.data);

              if (dataStr.includes("NOT_WHITELISTED_BY_USER_MESSAGE")) {
                throw new Error(
                  `This user does not allow private messages: ${body.to}`,
                );
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
          to: body.to,
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

        const storyResponse = await axios
          .get(`${newUrl}.json`)
          .catch((error) => {
            console.error(
              `Error fetching story from Reddit: ${JSON.stringify(error)}`,
            );

            throw new Error("Error fetching story from Reddit");
          })
          .then((res) => res);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const story = storyResponse.data[0].data.children[0]
          .data as PostFromReddit;

        return await prisma.redditPost.create({
          data: {
            content: story.selftext,
            flair: story.link_flair_text ?? undefined,
            userId: ctx.session.user.id,
            permission: true,
            read: false,
            story_length: story.selftext.length,
            post_id: story.id,
            reading_time: Math.round(story.selftext.length / 200),
            author: story.author,
            title: story.title,
            ups: story.ups,
            subreddit: story.subreddit,
            url: story.url,
            upvote_ratio: story.upvote_ratio,
            num_comments: story.num_comments,
            created: story.created_utc,
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
