import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.string().url()
  ),
  // Add `.min(1) on ID and SECRET if you want to make sure they're not empty

  REDDIT_CLIENT_ID: z.string(),
  REDDIT_CLIENT_SECRET: z.string(),
  BUNNY_PASSWORD: z.string(),
  STRIPE_TEST_KEY: z.string(),
  STRIPE_LIVE_KEY: z.string(),
  NEXT_URL: z.string().url(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  OPEN_AI_KEY: z.string(),
  OPEN_AI_ORG: z.string(),
  SENDGRID_API_KEY: z.string(),
  IBM_API_KEY: z.string(),
  IBM_URL: z.string(),
  SENTRY_DSN: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
  TEST_DATABASE_URL: z.string().url(),
  TEST_USERNAME: z.string(),
  TEST_PASSWORD: z.string(),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  NEXT_PUBLIC_STRIPE_BILLING_PORTAL_TEST_LINK: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
  BUNNY_PASSWORD: process.env.BUNNY_PASSWORD,
  STRIPE_TEST_KEY: process.env.STRIPE_TEST_KEY,
  STRIPE_LIVE_KEY: process.env.STRIPE_LIVE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_BILLING_PORTAL_TEST_LINK:
    process.env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_TEST_LINK,
  NEXT_URL: process.env.NEXT_URL,
  OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  OPEN_AI_ORG: process.env.OPEN_AI_ORG,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  IBM_API_KEY: process.env.IBM_API_KEY,
  IBM_URL: process.env.IBM_URL,
  NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  TEST_USERNAME: process.env.TEST_USERNAME,
  TEST_PASSWORD: process.env.TEST_PASSWORD,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
