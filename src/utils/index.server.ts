/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { proPlans } from "~/data/stripePlans";
import { stripeClient } from "./stripe";

export const checkForProperSubscription = async (customerId: string | null) => {
  if (!customerId) return false;

  const customer = await stripeClient.customers.retrieve(customerId, {
    expand: ["subscriptions"],
  });

  // @ts-expect-error
  return proPlans.includes(customer.subscriptions.data[0].plan.id);
};
