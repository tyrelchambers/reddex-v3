import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const overviewRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const submittedStories = await prisma.submittedStory.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const approvedStories = await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
        permission: true,
        read: false,
      },
    });

    const completedStories = await prisma.redditPost.findMany({
      where: {
        userId: ctx.session.user.id,
        permission: true,
        read: true,
      },
    });

    return {
      submittedStoriesCount: submittedStories.length,
      submittedStories: submittedStories,
      approvedStoriesCount: approvedStories.length,
      approvedStories: approvedStories
        .sort(
          (a, b) =>
            new Date(b.created).getTime() - new Date(a.created).getTime(),
        )
        .slice(0, 5),
      completedStoriesCount: completedStories.length,
    };
  }),
});
