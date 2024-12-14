import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { stripeClient } from "~/utils/stripe";
import { buffer } from "micro";
import { prisma } from "~/server/db";
import { StripeSubscription } from "~/types";
import { getCustomerId, hasActiveSubscription } from "~/utils";
import { isStripeCustomer } from "~/utils/typeguards";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
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
      env.STRIPE_WEBHOOK_SECRET,
    );

    data = event.data;
    eventType = event.type;
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`);
    return res.send(400);
  }

  try {
    if (eventType === "customer.subscription.updated") {
      // purpose is to auto hide their website if they switch from pro to basic
      const subscription = data.object as StripeSubscription;

      if (!subscription) throw new Error("No subscription provided in webhook");

      const userId = subscription.metadata.userId;

      if (hasActiveSubscription(subscription)) {
        await prisma.website.update({
          where: {
            userId,
          },
          data: {
            canBeEnabled: true,
          },
        });
      } else {
        await prisma.website.update({
          where: {
            userId,
          },
          data: {
            canBeEnabled: false,
            hidden: true,
          },
        });
      }

      if (!subscription.cancel_at_period_end) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            deleteOnDate: null,
          },
        });
      } else {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            deleteOnDate: new Date(subscription.current_period_end * 1000),
          },
        });
      }
    }

    if (eventType === "checkout.session.completed") {
      const { id, metadata, customer } = data.object as Stripe.Checkout.Session;

      const userId = metadata?.userId;

      const line_items = await stripeClient.checkout.sessions.listLineItems(id);

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!line_items?.data[0]?.price?.id) {
        return res.send(400);
      }

      if (!user) {
        console.log(`⚠️  User not found.`);
        return res.send(400);
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          customerId: isStripeCustomer(customer) ? customer.id : null,
        },
      });

      console.log(`🔔  Payment received!`);
    }
  } catch (error) {}

  res.send(202);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
