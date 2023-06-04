import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { stripeClient } from "~/utils/stripe";
import { buffer } from "micro";
import { prisma } from "~/server/db";

interface Body {
  data: Stripe.Event.Data;
}

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
    const { customer, subscription, id } =
      data.object as Stripe.Checkout.Session;

    const line_items = await stripeClient.checkout.sessions.listLineItems(id);

    const user = await prisma.user.findFirst({
      where: {
        Subscription: {
          customerId: customer as string,
        },
      },
      include: {
        Subscription: true,
      },
    });

    if (!line_items?.data[0]?.price?.id) {
      return res.send(400);
    }

    if (!user) {
      console.log(`⚠️  User not found.`);
      return res.send(400);
    }

    await prisma.subscription.update({
      where: {
        userId: user.id,
      },
      data: {
        subscriptionId: subscription as string,
        customerId: customer as string,
        plan: line_items.data[0].price.id,
      },
    });

    console.log(`🔔  Payment received!`);
  }

  res.send(202);
}

export const config = {
  api: {
    bodyParser: false,
  },
};