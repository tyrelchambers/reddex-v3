import { searchSchema } from "~/server/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from "axios";
import { PostFromReddit } from "~/types";

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
  search: publicProcedure.input(searchSchema).mutation(async ({ input }) => {
    const url = `https://www.reddit.com/r/${input.subreddit.toLowerCase()}/${input.category.toLowerCase()}.json?limit=100`;
    let posts = [] as {
      kind: string;
      data: PostFromReddit;
    }[];
    let after = ``;

    try {
      for (let i = 0; i < 10 && after !== null; i++) {
        await axios
          .get(`${url}&after=${after}`)
          .then((res: SubredditResponse) => {
            console.log(res);

            after = res.data.data.after;
            posts = posts.concat(res.data.data.children);
          });
      }
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch posts from Reddit");
    }

    return posts.map((p) => p.data);
  }),
});

export const config = {
  api: {
    responseLimit: false,
  },
};
