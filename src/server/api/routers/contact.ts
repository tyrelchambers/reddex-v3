import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { contactSchema } from "~/server/schemas";
import { captureException } from "@sentry/nextjs";

export const contactRouter = createTRPCRouter({
  save: protectedProcedure
    .input(contactSchema)
    .mutation(async ({ ctx, input }) => {
      try {
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
      } catch (error) {
        captureException(error);
      }
    }),
  getByName: protectedProcedure
    .input(z.string().optional())
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
