import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { z } from "zod";
import { saveProfileSchema } from "~/server/schemas";
import { captureException } from "@sentry/nextjs";
import Stripe from "stripe";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          Profile: {
            include: {
              searches: true,
            },
          },
        },
      });

      if (!user) return null;
      let subscription = null;

      const subscriptionQuery = await stripeClient.subscriptions.search({
        query: `metadata["userId"]: "${ctx.session.user.id}"`,
        expand: ["data.plan", "data.plan.product"],
        limit: 1,
      });

      if (subscriptionQuery.data.length > 0) {
        subscription = subscriptionQuery.data[0] as Stripe.Subscription & {
          plan: Stripe.Plan & {
            product: Stripe.Product;
          };
        };
      }

      return {
        ...user,
        subscription,
      };
    } catch (error) {
      captureException(error);
      throw error;
    }
  }),
  saveProfile: protectedProcedure
    .input(saveProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            email: input.email,

            Profile: {
              update: {
                words_per_minute: Number(input.words_per_minute),
                greeting: input.greeting,
                recurring: input.recurring,
              },
            },
          },
        });

        return user;
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  contactedWriters: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.contactedWriters.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  removeSearch: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const userProfile = await prisma.profile.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
        });
        return await prisma.recentlySearched.deleteMany({
          where: {
            id: input,
            profileId: userProfile?.id,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  // deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {}),
});
