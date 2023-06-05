import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { subscriptionSchema } from "~/server/schemas";
import { prisma } from "~/server/db";
import Stripe from "stripe";

interface BillingInfo {
  customer: Stripe.Customer;
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan & { product: Stripe.Product };
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
  createSubscription: protectedProcedure
    .input(subscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      const subscription = await prisma.subscription.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (subscription) {
        return;
      }

      return await prisma.subscription.create({
        data: {
          customerId: input.customerId,
          subscriptionId: input.subscriptionId,
          plan: input.plan,
          userId: ctx.session.user.id,
        },
      });
    }),
  info: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Subscription: true,
      },
    });

    if (!user?.Subscription) {
      return;
    }

    const customer = await stripeClient.customers.retrieve(
      user.Subscription.customerId
    );

    const subscription = (await stripeClient.subscriptions.retrieve(
      user.Subscription.subscriptionId || "",
      {
        expand: ["plan", "plan.product"],
      }
    )) as Stripe.Response<
      Stripe.Subscription & {
        plan: Stripe.Plan & { product: Stripe.Product };
      }
    >;

    const invoices = await stripeClient.invoices.list({
      customer: customer.id,
    });

    return {
      customer,
      subscription,
      invoices,
    } as BillingInfo;
  }),
  updateLink: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!subscription) {
      return;
    }

    const session = await stripeClient.billingPortal.sessions.create({
      customer: subscription.customerId,
    });

    return session.url;
  }),
});
