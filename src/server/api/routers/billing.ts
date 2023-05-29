import { createTRPCRouter, protectedProcedure } from "../trpc";

export const billingRouter = createTRPCRouter({
  createPortal: protectedProcedure.mutation(async ({ ctx }) => {}),
});
