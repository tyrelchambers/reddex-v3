import axios from "axios";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { refreshAccessToken } from "~/utils/refreshAccessToken";
import { RedditInboxResponse } from "~/types";
import { sendMessageSchema } from "~/server/schemas";

export const inboxRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userAccount = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        accounts: true,
      },
    });
    const redditAccount = userAccount?.accounts.find(
      (acc) => acc.provider === "reddit"
    );

    if (!redditAccount?.access_token) return;

    const accessToken = await refreshAccessToken(redditAccount);

    if (!accessToken) return;

    const inbox = await axios
      .get<RedditInboxResponse>(`https://oauth.reddit.com/message/messages`, {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      })
      .then((res) => res.data);

    return inbox;
  }),
  send: protectedProcedure
    .input(sendMessageSchema)
    .mutation(async ({ ctx, input }) => {
      const url = `https://oauth.reddit.com/api/comment`;
      const userAccount = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          accounts: true,
        },
      });
      const redditAccount = userAccount?.accounts.find(
        (acc) => acc.provider === "reddit"
      );

      if (!redditAccount?.access_token) return;

      const accessToken = await refreshAccessToken(redditAccount);

      if (!accessToken) return;

      const body = new FormData();
      body.set("thing_id", input.thing_id);
      body.set("text", input.message);
      body.set("return_rtjson", "true");

      await axios
        .post(url, body, {
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .catch(console.log);
    }),
});
