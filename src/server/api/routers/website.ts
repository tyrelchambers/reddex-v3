import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import {
  websiteGeneralSchema,
  websiteIntegrationsSchema,
  websiteSubmissionSchema,
  websiteThemeSchema,
} from "~/server/schemas";

export const websiteRouter = createTRPCRouter({
  checkAvailableSubdomain: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const existingWebsiteWithName = await prisma.website.findFirst({
        where: {
          name: input,
        },
      });
      return !!existingWebsiteWithName;
    }),
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.website.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  saveGeneral: protectedProcedure
    .input(websiteGeneralSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  saveTheme: protectedProcedure
    .input(websiteThemeSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  saveSubmissionForm: protectedProcedure
    .input(websiteSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  saveIntegrations: protectedProcedure
    .input(websiteIntegrationsSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  saveSettings: protectedProcedure
    .input(websiteSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          ...input,
        },
      });
    }),
  hideWebsite: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          hidden: input,
        },
      });
    }),
});
