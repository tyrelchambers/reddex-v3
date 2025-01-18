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
  to: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const site = req.query.site as string;

    if (req.method === "POST") {
      const input = req.body as Props;
      console.log(input);

      const website = await prisma.website.findFirst({
        where: {
          id: input.to,
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
      return res.send("ok");
    }
    console.log("Findin site for ", site);

    if (!site) {
      return res.status(400);
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

      const enabledCollections = await storefront.getEnabledCollections(
        shop?.id,
      );

      shopCollections =
        await storefront.collectionsWithProducts(enabledCollections);
    }

    res.json({ website, shop, shopCollections });
  } catch (error) {
    captureException(error);
    return res.status(500);
  }
}
