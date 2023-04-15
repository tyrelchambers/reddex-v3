import { searchSchema } from "~/server/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { RedditStory } from "@prisma/client";

interface SubredditResponse {
  data: {
    data: {
      after: string;
      children: {
        kind: string;
        data: Partial<RedditStory>;
      }[];
    };
  };
}

export const subredditSearchRouter = createTRPCRouter({
  search: publicProcedure
    .input(searchSchema)
    .mutation(async ({ ctx, input }) => {
      const url = `https://www.reddit.com/r/${input.subreddit.toLowerCase()}/${input.category.toLowerCase()}.json?limit=100`;
      let posts = [] as {
        kind: string;
        data: Partial<RedditStory>;
      }[];
      let after = ``;

      console.log(url);

      for (let i = 0; i < 1 && after !== null; i++) {
        await axios
          .get(`${url}&after=${after}`)
          .then((res: SubredditResponse) => {
            after = res.data.data.after;
            posts = posts.concat(res.data.data.children);
          })
          .catch((err: unknown) => err);
      }

      return posts;
    }),
});

export const config = {
  api: {
    responseLimit: false,
  },
};
