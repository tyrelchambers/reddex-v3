import { prisma } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { z } from "zod";
import { saveProfileSchema } from "~/server/schemas";
import { captureException } from "@sentry/nextjs";
import Stripe from "stripe";
import { isActiveSubscription } from "~/utils";

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
        query: `metadata["userId"]: '${ctx.session.user.id}'`,
        expand: ["data.plan", "data.plan.product"],
      });

      if (subscriptionQuery.data.length > 0) {
        subscription = subscriptionQuery.data.filter((sub) =>
          isActiveSubscription(sub),
        )[0] as Stripe.Subscription & {
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
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const subscriptionQuery = await stripeClient.subscriptions.search({
      query: `metadata["userId"]: "${ctx.session.user.id}"`,
      limit: 1,
    });

    const sub = subscriptionQuery.data[0];

    let deleteOn;

    if (!sub) {
      console.log("No subscription found");
    } else if (isActiveSubscription(sub)) {
      const deletedSub = await stripeClient.subscriptions.update(sub.id, {
        cancel_at_period_end: true,
      });

      if (deletedSub.cancel_at) {
        deleteOn = new Date(deletedSub.cancel_at * 1000);
      }
    }

    if (!deleteOn) {
      return await prisma.user.delete({
        where: {
          id: ctx.session.user.id,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          deleteOnDate: deleteOn,
        },
      });

      return {
        scheduled: true,
      };
    }
  }),
  cancelDeletion: protectedProcedure.mutation(async ({ ctx }) => {
    const subscriptionQuery = await stripeClient.subscriptions.search({
      query: `metadata["userId"]: "${ctx.session.user.id}"`,
      limit: 1,
    });

    const sub = subscriptionQuery.data[0];

    if (!sub) {
      throw new Error("No subscription found");
    }

    await stripeClient.subscriptions.update(sub.id, {
      cancel_at_period_end: false,
    });

    return await prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        deleteOnDate: null,
      },
    });
  }),
});
