import { z } from "zod";

export const searchSchema = z.object({
  subreddit: z.string(),
  category: z.string(),
});

export const postSchema = z.object({
  author: z.string(),
  flair: z.string().nullable(),
  num_comments: z.number(),
  post_id: z.string(),
  story_length: z.number(),
  title: z.string(),
  ups: z.number(),
  url: z.string(),
  subreddit: z.string(),
  permission: z.boolean().optional(),
  read: z.boolean().optional(),
  reading_time: z.number(),
  upvote_ratio: z.number(),
  created: z.number(),
});
