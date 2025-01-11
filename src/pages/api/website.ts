import { captureException } from "@sentry/node";
import { NextApiRequest, NextApiResponse } from "next";
import { Fourthwall } from "~/lib/storefront";
import { prisma } from "~/server/db";
import { sendEmail } from "~/utils/sendMail";

interface Props {
  author: string;
  title: string;
  email: string;
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const site = req.query.site as string;
      const input = req.body as Props;

      const regexSiteName = site.replace(/^([^.]+)\.reddex\.app$/, "");
      console.log("Findin site for ", regexSiteName);

      const website = await prisma.website.findFirst({
        where: {
          subdomain: regexSiteName,
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
          body: input.content,
          userId: siteOwner.id,
        },
      });

      if (siteOwner.email) {
        await sendEmail({
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
      res.send("ok");
    } catch (error) {
      captureException(error);
      res.status(500);
    }
  }

  const site = req.query.site as string;

  const regexSiteName = site.replace(/^([^.]+)\.reddex\.app$/, "");
  console.log("Findin site for ", regexSiteName);

  const website = await prisma.website.findFirst({
    where: {
      subdomain: site,
    },
    include: {
      submissionPage: {
        include: {
          submissionFormModules: {
            where: {
              enabled: true,
            },
          },
        },
      },
    },
  });
  const shop = await prisma.shop.findFirst({
    where: {
      websiteId: website?.id,
    },
  });

  let shopCollections;

  if (shop) {
    const storefront = new Fourthwall(shop?.token as string);

    const enabledCollections = await storefront.getEnabledCollections(shop?.id);

    shopCollections =
      await storefront.collectionsWithProducts(enabledCollections);
  }

  res.json({ website, shop: shopCollections });
}
