import { mockStripeCustomer } from "~/mockData/mockData";
import { vi } from "vitest";
import Stripe from "stripe";

interface MockStripeProps {
  customers: {
    search: () => Stripe.ApiSearchResultPromise<Stripe.Customer>;
  };
}

vi.mock("stripe", () => {
  return vi.fn(() => {
    return {
      customers: {
        search: () => Promise.resolve({ data: [mockStripeCustomer] }),
      },
    } as MockStripeProps;
  });
});
