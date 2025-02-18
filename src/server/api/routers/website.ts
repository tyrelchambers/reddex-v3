import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";
import {
  removeImageSchema,
  submitSchema,
  websiteCustomDomainSchema,
  websiteGeneralSchema,
  websiteIntegrationsSchema,
  websiteLayoutSchema,
  websiteSubmissionSchema,
  websiteThemeSchema,
  websiteTop3Schema,
} from "~/server/schemas";
import axios from "axios";
import { env } from "process";
import { captureException } from "@sentry/nextjs";
import { sendEmail } from "~/utils/sendMail";
import { createDeployment, deleteDeployment } from "~/lib/k8s";

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
        customDomain: true,
        WebsiteLayouts: true,
        top3: true,
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
      }),
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
          data: input,
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
          data: input,
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

        if (input.submissionFormModules.author) {
          await prisma.submissionFormModule.updateMany({
            where: {
              id: input.submissionFormModules.author.id,
            },
            data: {
              enabled: input.submissionFormModules.author.enabled,
              required: input.submissionFormModules.author.required,
            },
          });
        }

        if (input.submissionFormModules.title) {
          await prisma.submissionFormModule.updateMany({
            where: {
              id: input.submissionFormModules.title.id,
            },
            data: {
              enabled: input.submissionFormModules.title.enabled,
              required: input.submissionFormModules.title.required,
            },
          });
        }

        if (input.submissionFormModules.email) {
          await prisma.submissionFormModule.updateMany({
            where: {
              id: input.submissionFormModules.email.id,
            },
            data: {
              enabled: input.submissionFormModules.email.enabled,
              required: input.submissionFormModules.email.required,
            },
          });
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
            rssFeed: input.rssFeed,
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
      // we do this because there's a url for cdn images and a url for managing files
      // this sucks and is dirty, but ok for now
      const url = input.url.replace(
        "reddex.b-cdn.net",
        "storage.bunnycdn.com/reddex-images",
      );

      try {
        await prisma.website.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            banner: input.type === "banner" ? null : undefined,
            thumbnail: input.type === "thumbnail" ? null : undefined,
          },
        });
        return await axios.delete(url, {
          headers: {
            "content-type": "application/octet-stream",
            AccessKey: env.BUNNY_PASSWORD,
          },
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
  addCustomDomain: protectedProcedure
    .input(websiteCustomDomainSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input.domain || !input.websiteId) {
        throw Error("Missing domain or website ID");
      }

      await createDeployment({
        domainName: input.domain,
        websiteId: input.websiteId,
      });
      return await prisma.websiteCustomDomain.create({
        data: {
          domain: input.domain,
          Website: {
            connect: {
              id: input.websiteId,
            },
          },
          verified: false,
        },
      });
    }),
  removeCustomDomain: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        domainName: z.string(),
        websiteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await deleteDeployment({
        websiteId: input.websiteId,
        domainName: input.domainName,
      });
      return await prisma.websiteCustomDomain.delete({
        where: {
          id: input.id,
        },
      });
    }),
  layouts: protectedProcedure
    .input(websiteLayoutSchema)
    .mutation(async ({ ctx, input }) => {
      const website = await prisma.website.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!website) {
        captureException(
          new Error("[ROUTER] [WEBSITE] [LAYOUTS] Website not found"),
        );
        return;
      }

      if (input.id) {
        await prisma.websiteLayouts.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
      } else {
        await prisma.websiteLayouts.create({
          data: {
            ...input,
            websiteId: website.id,
          },
        });
      }
    }),
  updateTop3: protectedProcedure
    .input(websiteTop3Schema)
    .mutation(async ({ ctx, input }) => {
      if (!input.websiteId) throw new Error("Missing website ID");

      for (let index = 0; index < input.data.length; index++) {
        const element = input.data[index];

        if (!element) continue;

        if (element.id) {
          await prisma.top3.update({
            where: {
              id: element.id,
            },
            data: {
              url: element.url,
              type: element.type,
              label: element.label,
            },
          });
          continue;
        } else {
          await prisma.top3.create({
            data: {
              url: element.url,
              type: element.type,
              websiteId: input.websiteId,
              index: element.index,
              label: element.label,
            },
          });
        }
      }
    }),
});
