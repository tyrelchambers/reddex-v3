import axios from "axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import {
  MixpanelEvents,
  RedditInboxMessage,
  RedditInboxResponse,
} from "~/types";
import { sendMessageSchema } from "~/server/schemas";
import { z } from "zod";
import { captureException } from "@sentry/nextjs";
import { trackEvent } from "~/utils/mixpanel";
import { getAccessTokenFromServer } from "~/server/queries";

export const inboxRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    try {
      const accessToken = await getAccessTokenFromServer(ctx.session.user.id);

      if (!accessToken) return;

      const inbox = await axios
        .get<RedditInboxResponse>(`https://oauth.reddit.com/message/messages`, {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        })
        .then((res) => res.data);

      return inbox.data.children.map((item) => item.data);
    } catch (error) {
      captureException(error);
    }
  }),
  send: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const url = `https://oauth.reddit.com/api/comment`;
        const accessToken = await getAccessTokenFromServer(ctx.session.user.id);

        if (!accessToken) return;

        const body = new FormData();

        // thing_id is the name of the recipient
        body.set("thing_id", input.thing_id);
        body.set("text", input.message);
        body.set("return_rtjson", "true");

        await axios.post(url, body, {
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  search: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const query = input.toLowerCase();
      const accessToken = await getAccessTokenFromServer(ctx.session.user.id);

      if (!accessToken) return;

      const posts: RedditInboxMessage[] = [];
      let after = ``;

      for (let i = 0; i < 10 && after !== null; i++) {
        await axios
          .get<RedditInboxResponse>(
            `https://oauth.reddit.com/message/messages?after=${after}`,
            {
              headers: {
                Authorization: `bearer ${accessToken}`,
              },
            },
          )
          // eslint-disable-next-line no-loop-func
          .then((res) => {
            posts.push(
              res.data.data.children.map(
                (post) => post.data,
              ) as unknown as RedditInboxMessage,
            );
            after = res.data.data.after;
          });
      }

      const found = posts
        .flat()
        .filter(
          (post) =>
            post.subject.toLowerCase().includes(query) ||
            post.dest.toLowerCase().includes(query),
        );

      trackEvent(MixpanelEvents.SEARCH_INBOX);

      return found;
    } catch (error) {
      captureException(error);
      throw error;
    }
  }),
  findPostByTitle: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      const subject = input?.endsWith("...") ? input.slice(0, -3) : input;

      const post = await prisma.redditPost.findFirst({
        where: {
          title: {
            contains: subject,
          },
        },
      });

      return post;
    }),
  lastTimeContactMessaged: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const lastMessage = await prisma.inboxMessage.findMany({
        where: {
          from: ctx.session.user.id,
          to: input,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return lastMessage?.[0];
    }),
});
