import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { updateBillingSchema } from "~/server/schemas";
import { prisma } from "~/server/db";

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
  updateBilling: protectedProcedure
    .input(updateBillingSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          Subscription: {
            update: {
              customerId: input.customerId,
              subscriptionId: input.subscriptionId,
            },
          },
        },
      });
    }),
  info: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        Subscription: true,
      },
    });
    const customer =
      user?.Subscription?.customerId &&
      (await stripeClient.customers.retrieve(user?.Subscription?.customerId));

    const subscription =
      user?.Subscription?.subscriptionId &&
      (await stripeClient.subscriptions.retrieve(
        user?.Subscription?.subscriptionId
      ));

    return {
      customer,
      subscription,
    };
  }),
});
