import { stripeClient } from "~/utils/stripe";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CHECKOUT_SUCCESS_URL } from "~/url.constants";
import { createCheckoutSchema } from "~/server/schemas";
import { z } from "zod";
import Stripe from "stripe";
import { captureException } from "@sentry/nextjs";

export const stripeRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    .input(createCheckoutSchema)
    .mutation(async ({ ctx, input }) => {
      try {
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
          expand: ["line_items"],
          metadata: {
            userId: ctx.session?.user.id,
          },
        });

        return link.url;
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  getSession: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return (await stripeClient.checkout.sessions.retrieve(input, {
      expand: ["invoice"],
    })) as Stripe.Response<
      Stripe.Checkout.Session & {
        invoice: Stripe.Invoice;
      }
    >;
  }),
});
