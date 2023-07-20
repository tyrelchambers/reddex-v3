import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";
import {
  removeImageSchema,
  websiteGeneralSchema,
  websiteIntegrationsSchema,
  websiteSubmissionSchema,
  websiteThemeSchema,
} from "~/server/schemas";
import axios, { AxiosError } from "axios";
import { env } from "process";

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
  settings: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.website.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        submissionPage: {
          include: {
            submissionFormModules: true,
          },
        },
      },
    });
  }),
  // this route exists so we can toggle visibility without resetting form values
  visibility: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.website.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        hidden: true,
      },
    });
  }),
  submissionFormVisibility: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        hidden: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.submissionPage.update({
        where: {
          id: input.id,
        },
        data: {
          hidden: input.hidden,
        },
      });
    }),
  getSubmissionFormVisibility: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input }) => {
      return await prisma.submissionPage.findUnique({
        where: {
          id: input,
        },
        select: {
          hidden: true,
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
      const existingWebsite = await prisma.website.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          submissionPage: true,
        },
      });

      await prisma.submissionPage.update({
        where: {
          id: existingWebsite?.submissionPageId,
        },
        data: {
          description: input.description,
          name: input.name,
          subtitle: input.subtitle,
        },
      });

      for (let index = 0; index < input.submissionFormModules.length; index++) {
        const element = input.submissionFormModules[index];

        if (element) {
          await prisma.submissionFormModule.updateMany({
            where: {
              id: element.id,
            },
            data: {
              enabled: element.enabled,
              required: element.required,
            },
          });
        }
      }
    }),
  saveIntegrations: protectedProcedure
    .input(websiteIntegrationsSchema)
    .mutation(async ({ ctx, input }) => {
      return await prisma.website.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          youtubeIntegrationId: input.youtubeIntegrationId,
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
  setVisibility: protectedProcedure
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
  removeImage: protectedProcedure
    .input(removeImageSchema)
    .mutation(async ({ ctx, input }) => {
      return await axios
        .delete(input.url, {
          headers: {
            "content-type": "application/octet-stream",
            AccessKey: env.BUNNY_PASSWORD,
          },
        })
        .then(async () => {
          await prisma.website.update({
            where: {
              userId: ctx.session.user.id,
            },
            data: {
              banner: input.type === "banner" ? null : undefined,
              thumbnail: input.type === "thumbnail" ? null : undefined,
            },
          });
        })
        .catch((err: AxiosError) => {
          if (err) {
            throw new Error(err.message);
          }
        });
    }),
});
