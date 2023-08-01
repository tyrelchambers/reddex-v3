import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import { contactSchema, editContactSchema } from "~/server/schemas";
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
  updateContact: protectedProcedure
    .input(editContactSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return await prisma.contact.update({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: {
          ...rest,
        },
      });
    }),
  getContactById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await prisma.contact.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
  deleteContact: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await prisma.contact.delete({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
