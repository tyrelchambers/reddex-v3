import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const statsRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    const [storiesCount, postsCount, userCount] = await Promise.all([
      prisma.submittedStory.count(),
      prisma.stats
        .findFirst({
          select: {
            posts: true,
          },
        })
        .then((res) => res?.posts),
      prisma.user.count(),
    ]);

    return {
      stories: storiesCount,
      posts: postsCount,
      users: userCount,
    };
  }),
  set: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    const statModel = await prisma.stats.findFirst();

    if (!statModel) {
      return await prisma.stats.create({
        data: {
          posts: input,
        },
      });
    }

    return await prisma.stats.update({
      where: { id: statModel.id },
      data: {
        posts: {
          increment: input,
        },
      },
    });
  }),
});
