import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { subredditSearchRouter } from "./routers/subredditSearch";
import { storyRouter } from "./routers/stories";
import { contactRouter } from "./routers/contact";
import { tagRouter } from "./routers/tag";
import { inboxRouter } from "./routers/inbox";
import { websiteRouter } from "./routers/website";
import { billingRouter } from "./routers/billing";
import { stripeRouter } from "./routers/stripe";
import { statsRouter } from "./routers/stats";
import { overviewRouter } from "./routers/overview";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  subredditSearch: subredditSearchRouter,
  story: storyRouter,
  contact: contactRouter,
  tag: tagRouter,
  inbox: inboxRouter,
  website: websiteRouter,
  billing: billingRouter,
  stripe: stripeRouter,
  stats: statsRouter,
  overview: overviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
