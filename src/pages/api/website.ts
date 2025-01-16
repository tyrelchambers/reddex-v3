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
  const site = req.query.site as string;
  console.log("site", site);

  console.log("Findin site for ", site);

  if (!site) {
    res.status(400);
    return;
  }

  if (req.method === "POST") {
    const input = req.body as Props;
    try {
      const website = await prisma.website.findFirst({
        where: {
          subdomain: site,
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

  const website = await prisma.website.findUnique({
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

  const shop = await prisma.shop.findUnique({
    where: {
      websiteId: website?.id,
    },
  });

  let shopCollections;

  if (shop && shop.token) {
    const storefront = new Fourthwall(shop.token);

    const enabledCollections = await storefront.getEnabledCollections(shop?.id);

    shopCollections =
      await storefront.collectionsWithProducts(enabledCollections);
  }

  res.json({ website, shop, shopCollections });
}
