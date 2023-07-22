import { mockStripeCustomer } from "~/mockData/mockData";
import { vi } from "vitest";
import { Stripe as _Stripe } from "stripe";

class Stripe {
  customers: Pick<_Stripe.CustomersResource, "search">;

  constructor() {
    this.customers = {
      search: vi.fn().mockResolvedValue({ data: [mockStripeCustomer] }),
    };
  }
}
const stripe = vi.fn(() => new Stripe());

export default stripe;
export { Stripe };
