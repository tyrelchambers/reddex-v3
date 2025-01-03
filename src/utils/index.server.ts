import { stripeClient } from "./stripe";
import { isActiveSubscription } from ".";
import { InboxMessage } from "@prisma/client";
import { prisma } from "~/server/db";

export const checkForProperSubscription = async (userId: string | null) => {
  if (!userId) return false;

  const subscription = await stripeClient.subscriptions.search({
    query: `metadata["userId"]: "${userId}"`,
    expand: ["data.plan", "data.plan.product"],
    limit: 1,
  });

  if (!subscription.data[0]) return false;
  return (
    subscription.data.length > 0 && isActiveSubscription(subscription.data[0])
  );
};

export const saveInboxMessage = async (
  data: Omit<InboxMessage, "id" | "createdAt">,
) => {
  await prisma.inboxMessage.create({
    data: {
      subject: data.subject,
      to: data.to,
      redditPostId: data.redditPostId,
    },
  });
};
