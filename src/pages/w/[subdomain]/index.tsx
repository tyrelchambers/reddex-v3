import { SubmissionPage, Website } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps, type NextPage } from "next";
import { YOUTUBE_URL } from "~/constants";
import { prisma } from "~/server/db";
import YouTube from "react-youtube";
import { checkForProperSubscription } from "~/utils/index.server";
import CustomerSiteHeader from "~/layouts/CustomSite/CustomerSiteHeader";
import { useEffect } from "react";
import Image from "next/image";
import { api } from "~/utils/api";

interface Props {
  website: (Website & { submissionPage: SubmissionPage }) | null;
  youtubeVideos: YoutubeVideo[];
}

interface YoutubeVideo {
  kind: string;
  etag: string;
  id: { kind: string; videoId: string };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    channelTitle: string;
    liveBroadcastContent: string;
    publishTime: string;
  };
}

interface YoutubeResponse {
  items: YoutubeVideo[];
}

const Home: NextPage<Props> = ({ website, youtubeVideos }) => {
  const collections = api.shop.collections.useQuery(website?.id as string, {
    enabled: !!website?.id,
  });
  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      html.setAttribute("data-mantine-color-scheme", website?.theme ?? "light");
    }
  }, [website]);

  if (!website) return null;

  return (
    <section className="min-h-screen bg-background">
      <CustomerSiteHeader website={website} />

      <section className="mx-auto mt-10 w-full max-w-[1500px] p-4 lg:p-0">
        <section className="mx-auto flex h-fit items-center overflow-hidden rounded-xl lg:h-[500px]">
          <Image
            src={
              website.banner ??
              "https://images.unsplash.com/photo-1506259091721-347e791bab0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFic3RyYWN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
            }
            alt=""
            width={1500}
            height={500}
          />
        </section>
        {website.description && (
          <div className="my-8 max-w-3xl text-foreground">
            <h2 className="text-3xl font-semibold">Welcome!</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-loose text-foreground/70">
              {website.description}
            </p>
          </div>
        )}

        {youtubeVideos && (
          <section className="my-20">
            <h2 className="text-foreground">Latest Youtube videos</h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {youtubeVideos.map((item) => (
                <YouTube
                  key={item.id.videoId}
                  videoId={item.id.videoId}
                  className="youtube-video"
                />
              ))}
            </div>
          </section>
        )}
        <footer className="mt-10 flex justify-center pb-10">
          <p className="text-sm font-thin text-gray-500">
            Powered by{" "}
            <a href="https://reddex.app" className="text-blue-500">
              Reddex.
            </a>
          </p>
        </footer>
      </section>
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const subdomain = ctx.query.subdomain as string;

  if (!subdomain) return { props: {} };

  const website = await prisma.website.findUnique({
    where: {
      subdomain,
    },

    include: {
      submissionPage: {
        include: {
          submissionFormModules: true,
        },
      },
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  const user = website?.user;

  if (!user) {
    return {
      notFound: true,
    };
  }

  const hasSubscription = await checkForProperSubscription(user.id);

  if (website?.hidden || !hasSubscription || !website)
    return {
      notFound: true,
    };

  const videos = website?.youtubeIntegrationId
    ? await axios
        .get<YoutubeResponse>(YOUTUBE_URL(website.youtubeIntegrationId), {
          headers: {
            Referer: ctx.req.headers.referer,
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        })
        .then((res) => res.data.items)
        .catch((err) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (err instanceof Error) {
            console.log(err.message);
          } else {
            console.log(err);
          }
        })
    : null;

  return {
    props: {
      website,
      youtubeVideos: videos ?? null,
    },
  };
};

export default Home;
