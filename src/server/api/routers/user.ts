import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { z } from "zod";
import { saveProfileSchema } from "~/server/schemas";
import Stripe from "stripe";
import { captureException } from "@sentry/nextjs";

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

      let subscription = null;

      if (!user) return null;

      if (user.customerId) {
        const customer = (await stripeClient.customers.retrieve(
          user.customerId,
          {
            expand: [
              "subscriptions",
              "subscriptions.data.plan",
              "subscriptions.data.plan.product",
            ],
          }
        )) as unknown as Stripe.Customer & {
          subscriptions: Stripe.Subscription[] & {
            plan: Stripe.Plan;
          };
        };

        subscription = customer?.subscriptions?.data[0] ?? null;
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
      if (!input.email) throw new Error("No email provided.");

      try {
        const user = await prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            email: input.email,

            Profile: {
              update: {
                words_per_minute: input.words_per_minute,
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
