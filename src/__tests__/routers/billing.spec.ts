import { inferProcedureInput } from "@trpc/server";
import { beforeEach, describe, test, vi } from "vitest";
import { AppRouter, appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

vi.mock("~/env.mjs", async () => {
  const { mockEnv } = await import("~/mockData/mockData");

  return {
    env: mockEnv,
  };
});

vi.mock("stripe", async () => {
  return await import("~/__mocks__/stripe");
});

describe("billingRouter", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  test("createCustomer", async () => {
    const ctx = createInnerTRPCContext({
      session: { user: { id: "123", name: "John Doe" }, expires: "1" },
    });
    const caller = appRouter.createCaller(ctx);

    type Input = inferProcedureInput<AppRouter["billing"]["createCustomer"]>;
    const input: Input = "some@email.com";

    const example = await caller.billing.createCustomer(input);

    console.log(example);
  });
});
