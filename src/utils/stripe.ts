import Stripe from "stripe";
import { env } from "~/env";

const stripeKey =
  env.NODE_ENV === "production" ? env.STRIPE_LIVE_KEY : env.STRIPE_TEST_KEY;

export const stripeClient = new Stripe(stripeKey, {
  apiVersion: "2024-12-18.acacia",
});
