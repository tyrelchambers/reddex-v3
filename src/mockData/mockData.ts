import Stripe from "stripe";

export const mockStripeCustomer: Stripe.Customer = {
  id: "cus_xxx",
  object: "customer",
  address: null,
  balance: -4972,
  created: 1689812247,
  currency: "cad",
  default_source: null,
  delinquent: false,
  description: null,
  discount: null,
  email: "some@email.com",
  invoice_prefix: "xxx",
  invoice_settings: {
    custom_fields: null,
    default_payment_method: null,
    footer: null,
    rendering_options: null,
  },
  livemode: false,
  metadata: {},
  name: null,
  next_invoice_sequence: 17,
  phone: null,
  preferred_locales: [],
  shipping: null,
  tax_exempt: "none",
  test_clock: null,
};

export const mockEnv = {
  DATABASE_URL: "xxx",
  NODE_ENV: "xxx",
  NEXTAUTH_SECRET: "xxx",
  NEXTAUTH_URL: "xxx",
  REDDIT_CLIENT_ID: "xxx",
  REDDIT_CLIENT_SECRET: "xxx",
  BUNNY_PASSWORD: "xxx",
  STRIPE_TEST_KEY: "xxx",
  STRIPE_LIVE_KEY: "xxx",
  STRIPE_WEBHOOK_SECRET: "xxx",
  NEXT_URL: "xxx",
  OPEN_AI_KEY: "xxx",
  OPEN_AI_ORG: "xxx",
  SENDGRID_API_KEY: "xxx",
  IBM_API_KEY: "xxx",
  IBM_URL: "xxx",
  NEXT_PUBLIC_NODE_ENV: "xxx",
  SENTRY_DSN: "xxx",
  NEXT_PUBLIC_SENTRY_DSN: "xxx",
};
