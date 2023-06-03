import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { subredditSearchRouter } from "./routers/subredditSearch";
import { postRouter } from "./routers/post";
import { contactRouter } from "./routers/contact";
import { tagRouter } from "./routers/tag";
import { inboxRouter } from "./routers/inbox";
import { websiteRouter } from "./routers/website";
import { billingRouter } from "./routers/billing";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  subredditSearch: subredditSearchRouter,
  post: postRouter,
  contact: contactRouter,
  tag: tagRouter,
  inbox: inboxRouter,
  website: websiteRouter,
  billing: billingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
