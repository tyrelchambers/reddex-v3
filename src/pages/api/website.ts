import { captureException } from "@sentry/node";
import { NextApiRequest, NextApiResponse } from "next";
import { Fourthwall } from "~/lib/storefront";
import { prisma } from "~/server/db";
import { sendEmail } from "~/utils/sendMail";

interface Props {
  author: string;
  title: string;
  email: string;
  story: string;
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

      console.log(input);

      await prisma.submittedStory.create({
        data: {
          email: input.email,
          author: input.author,
          title: input.title,
          body: input.story,
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
      return res.send(200);
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
        user: true,
        WebsiteLayouts: {
          where: {
            enabled: true,
          },
        },
      },
    });

    if (!website) {
      return res.status(404).send({ error: "Website not found" });
    }
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

    const submittedStories = await prisma.submittedStory.findMany({
      where: {
        userId: website.user.id,
      },
    });

    res.json({ website, shop, shopCollections, submittedStories });
  } catch (error) {
    captureException(error);
    return res.status(500).send({ error: "Something went wrong" });
  }
}
