import { z } from "zod";

export const searchSchema = z.object({
  subreddit: z.string(),
  category: z.string(),
});
