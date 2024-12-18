import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { prisma } from "~/server/db";
import Stripe from "stripe";
import { captureException } from "@sentry/nextjs";

interface BillingInfo {
  invoices: Stripe.ApiList<Stripe.Invoice>;
}

export const billingRouter = createTRPCRouter({
  createCustomer: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const existingStripeCustomer = await stripeClient.customers
          .search({
            query: `email:\'${input}\'`,
            limit: 1,
          })
          .then((res) => res.data[0])
          .catch(() => null);

        const user = await prisma.user.findFirst({
          where: {
            id: ctx.session.user.id,
          },
        });

        if (existingStripeCustomer && user?.customerId) {
          return existingStripeCustomer.id;
        }

        if (!user?.customerId) {
          const customer = existingStripeCustomer
            ? existingStripeCustomer
            : await stripeClient.customers.create({
                email: input,
              });

          await prisma.user.update({
            where: {
              id: ctx.session.user.id,
            },
            data: {
              customerId: customer.id,
            },
          });

          return customer.id;
        }
      } catch (error) {
        console.log(error);
        captureException(error);
      }
    }),

  info: protectedProcedure.query(async ({ ctx }) => {
    try {
      const subscriptionQuery = await stripeClient.subscriptions.search({
        query: `status: 'active' AND metadata["userId"]: "${ctx.session.user.id}"`,
      });

      const invoices = await stripeClient.invoices.list({
        subscription: subscriptionQuery.data[0]?.id,
      });

      return {
        invoices,
      } as BillingInfo;
    } catch (error) {
      captureException(error);
    }
  }),
  updateLink: protectedProcedure.mutation(() => {
    try {
      const url = "https://billing.stripe.com/p/login/test_fZe4iffki7hw9lm9AA";
      return url;
    } catch (error) {
      captureException(error);
    }
  }),
});
