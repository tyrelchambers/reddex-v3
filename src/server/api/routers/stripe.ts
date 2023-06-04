import { stripeClient } from "~/utils/stripe";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { CHECKOUT_SUCCESS_URL } from "~/url.constants";
import { createCheckoutSchema } from "~/server/schemas";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
  createCheckout: publicProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ input }) => {
      const link = await stripeClient.checkout.sessions.create({
        line_items: [
          {
            price: input.plan,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: CHECKOUT_SUCCESS_URL,
        customer: input.customerId,
        allow_promotion_codes: true,
      });

      return link.url;
    }),
  getSession: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await stripeClient.checkout.sessions.retrieve(input);
  }),
});
