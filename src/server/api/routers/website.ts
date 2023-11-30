import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import {
  removeImageSchema,
  submitSchema,
  websiteGeneralSchema,
  websiteIntegrationsSchema,
  websiteSubmissionSchema,
  websiteThemeSchema,
} from "~/server/schemas";
import axios, { AxiosError } from "axios";
import { env } from "process";
import { captureException } from "@sentry/nextjs";
import { sendEmail } from "~/utils/sendMail";

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
      try {
        return await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            ...input,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  saveTheme: protectedProcedure
    .input(websiteThemeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            ...input,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  saveSubmissionForm: protectedProcedure
    .input(websiteSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
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

        for (
          let index = 0;
          index < input.submissionFormModules.length;
          index++
        ) {
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
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  saveIntegrations: protectedProcedure
    .input(websiteIntegrationsSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            youtubeIntegrationId: input.youtubeIntegrationId,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  saveSettings: protectedProcedure
    .input(websiteSubmissionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            ...input,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  setVisibility: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      try {
        return await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            hidden: input,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  removeImage: protectedProcedure
    .input(removeImageSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input.url);

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
            console.log(err);

            if (err) {
              throw new Error(err.message);
            }
          });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  submit: publicProcedure.input(submitSchema).mutation(async ({ input }) => {
    const website = await prisma.website.findUnique({
      where: {
        id: input.siteId,
      },
      include: {
        user: true,
      },
    });
    const siteOwner = website?.user;

    if (!siteOwner) {
      throw new Error("Site not found");
    }

    await prisma.submittedStory.create({
      data: {
        email: input.email,
        author: input.author,
        title: input.title,
        body: input.story,
        sent_to_others: input.sent_to_others,
        userId: siteOwner.id,
      },
    });

    if (siteOwner.email) {
      sendEmail({
        to: siteOwner.email,
        subject: "New Story Submission",
        template: "storySubmission",
        dynamics: {
          host: `Reddex`,
          title: input.title || "* No title provided *",
          author: input.author || "* No author provided *",
        },
      });
    }
  }),
});
