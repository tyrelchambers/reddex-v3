import Stripe from "stripe";

export const isStripeCustomer = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): customer is Stripe.Customer => {
  if (typeof customer === "string" || customer.deleted) return false;
  return true;
};

export const isDeletedCustomer = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
): customer is Stripe.DeletedCustomer => {
  if (typeof customer === "string" || !customer.deleted) return false;

  return true;
};
