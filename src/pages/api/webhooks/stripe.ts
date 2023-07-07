import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { stripeClient } from "~/utils/stripe";
import { buffer } from "micro";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let data: Stripe.Event.Data;
  let eventType: string;
  const reqBuffer = await buffer(req);
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;
  const signature = req.headers["stripe-signature"] as string;

  console.log("--- Processing subscription webhook event ---");

  try {
    event = stripeClient.webhooks.constructEvent(
      reqBuffer,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    data = event.data;
    eventType = event.type;
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    return res.send(400);
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.send(202);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
