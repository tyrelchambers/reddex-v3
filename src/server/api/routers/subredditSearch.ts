import { searchSchema } from "~/server/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { MixpanelEvents, PostFromReddit } from "~/types";
import { prisma } from "~/server/db";
import { captureException } from "@sentry/nextjs";
import { trackEvent } from "~/utils/mixpanel";

interface SubredditResponse {
  data: {
    data: {
      after: string;
      children: {
        kind: string;
        data: PostFromReddit;
      }[];
    };
  };
}

export const subredditSearchRouter = createTRPCRouter({
  search: publicProcedure
    .input(searchSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const url = `https://www.reddit.com/r/${input.subreddit.toLowerCase()}/${input.category.toLowerCase()}.json?limit=100`;
        let posts = [] as {
          kind: string;
          data: PostFromReddit;
        }[];
        let after = ``;

        if (ctx.session?.user) {
          const userProfile = await prisma.profile.findUnique({
            where: {
              userId: ctx.session?.user.id,
            },
            include: {
              searches: true,
            },
          });
          const recentlySearchedMap =
            userProfile?.searches.map((s) => s.text) || null;

          if (
            userProfile &&
            recentlySearchedMap &&
            !recentlySearchedMap.includes(input.subreddit)
          ) {
            await prisma.recentlySearched.create({
              data: {
                text: input.subreddit,
                profileId: userProfile.id,
              },
            });
          }
        }

        try {
          for (let i = 0; i < 10 && after !== null; i++) {
            await axios
              .get(`${url}&after=${after}`)
              .then((res: SubredditResponse) => {
                after = res.data.data.after;
                posts = posts.concat(res.data.data.children);
              });
          }
        } catch (error) {
          console.error(error);
          throw new Error("Failed to fetch posts from Reddit");
        }

        trackEvent(MixpanelEvents.SUBREDDIT_SEARCH);

        return posts.map((p) => p.data);
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
});

export const config = {
  api: {
    responseLimit: false,
  },
};
