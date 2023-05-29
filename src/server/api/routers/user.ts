import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { z } from "zod";
import { saveProfileSchema } from "~/server/schemas";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Profile: true,
        Subscription: true,
      },
    });
  }),
  subscription: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      console.log(input);

      if (!input) {
        return null;
      }
      const subscription = await stripeClient.customers.retrieve(input);
      console.log(subscription);
    }),
  saveProfile: protectedProcedure
    .input(saveProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          email: input.email,
          Profile: {
            update: {
              words_per_minute: input.words_per_minute,
            },
          },
        },
      });
      return user;
    }),
});
