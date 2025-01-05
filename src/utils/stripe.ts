import Stripe from "stripe";
import { env } from "~/env";

const stripeKey =
  env.NODE_ENV === "production" ? env.STRIPE_LIVE_KEY : env.STRIPE_TEST_KEY;

export const stripeClient = new Stripe(stripeKey, {
  apiVersion: "2024-12-18.acacia",
});

export const getCustomerPortalLink = () => {
  if (process.env.NODE_ENV === "production") {
    return "https://billing.stripe.com/p/login/14k9Cs6w9drR1SUdQQ";
  }

  return "https://billing.stripe.com/p/login/test_fZe4iffki7hw9lm9AA";
};
