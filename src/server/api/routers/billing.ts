import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { prisma } from "~/server/db";
import Stripe from "stripe";

interface BillingInfo {
  customer: Stripe.Customer & {
    subscriptions: Stripe.Subscription[] & { plan: Stripe.Plan };
  };
  invoices: Stripe.ApiList<Stripe.Invoice>;
}

export const billingRouter = createTRPCRouter({
  createCustomer: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const existingCustomer = await stripeClient.customers
          .search({
            query: `email:\'${input}\'`,
            limit: 1,
          })
          .then((res) => res.data[0])
          .catch(() => null);

        if (existingCustomer) {
          return existingCustomer.id;
        }

        const customer = await stripeClient.customers.create({
          email: input,
        });

        return customer.id;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),

  info: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user?.customerId) {
      return;
    }

    const customer = (await stripeClient.customers.retrieve(user.customerId, {
      expand: [
        "subscriptions",
        "subscriptions.data.plan",
        "subscriptions.data.plan.product",
      ],
    })) as unknown as Stripe.Customer & {
      subscriptions: Stripe.Subscription[] & {
        plan: Stripe.Plan;
      };
    };

    const invoices = await stripeClient.invoices.list({
      customer: customer.id,
    });

    return {
      customer,
      invoices,
    } as BillingInfo;
  }),
  updateLink: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user?.customerId) {
      return;
    }

    const session = await stripeClient.billingPortal.sessions.create({
      customer: user.customerId,
    });

    return session.url;
  }),
});
