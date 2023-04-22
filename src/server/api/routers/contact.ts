import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { contactSchema } from "~/server/schemas";

export const contactRouter = createTRPCRouter({
  save: protectedProcedure
    .input(contactSchema)
    .mutation(async ({ ctx, input }) => {
      const existingContact = await prisma.contact.findFirst({
        where: {
          name: input.name,
        },
      });

      if (existingContact) return;

      return await prisma.contact.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
  getByName: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await prisma.contact.findFirst({
        where: {
          name: input,
          userId: ctx.session.user.id,
        },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.contact.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
