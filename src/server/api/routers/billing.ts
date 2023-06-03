import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripeClient } from "~/utils/stripe";
import { apiBaseUrl } from "~/url.constants";

export const billingRouter = createTRPCRouter({
  createPortal: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      console.log("#_#_#_#_#_# ", input);

      if (!input) throw new Error("No customer ID provided");

      const customerId = input;
      const session = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${apiBaseUrl}/dashboard/settings/`,
      });

      return session.url;
    }),
});
