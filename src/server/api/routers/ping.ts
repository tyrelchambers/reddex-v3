import { ping } from "~/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const pingRouter = createTRPCRouter({
  ping: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    await ping(input);
  }),
});
