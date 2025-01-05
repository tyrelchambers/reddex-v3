import {
  faTwitter,
  faInstagram,
  faYoutube,
  faPatreon,
  faFacebook,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-regular-svg-icons";
import { faHashtag } from "@fortawesome/pro-solid-svg-icons";
import { SubmissionPage, Website } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SocialList from "~/components/SocialList";
import { buttonVariants } from "~/components/ui/button";

interface Props {
  website: (Website & { submissionPage: SubmissionPage }) | null;
}

const CustomerSiteHeader = ({ website }: Props) => {
  if (!website) return null;

  const socials = [
    {
      url: website.twitter,
      icon: faTwitter,
      app: "twitter",
    },
    {
      url: website.instagram,
      icon: faInstagram,
      app: "instagram",
    },
    {
      url: website.youtube,
      icon: faYoutube,
      app: "youtube",
    },
    {
      url: website.patreon,
      icon: faPatreon,
      app: "patreon",
    },
    {
      url: website.podcast,
      icon: faPodcast,
      app: "podcast",
    },
    {
      url: website.facebook,
      icon: faFacebook,
      app: "facebook",
    },
    {
      url: website.ohcleo,
      icon: faHashtag,
      app: "ohcleo",
    },
    {
      url: website.tiktok,
      icon: faTiktok,
      app: "tiktok",
    },
  ];

  return (
    <>
      <div
        className="h-[5px] w-full"
        style={{ backgroundColor: website.colour }}
      ></div>
      <header className="flex flex-col items-center justify-between gap-2 bg-card p-4 sm:flex-row">
        <div className="flex flex-1 items-center text-xl text-foreground">
          {website.thumbnail && (
            <Image
              src={website.thumbnail}
              width={50}
              height={50}
              alt=""
              className="mr-2 rounded-md"
            />
          )}
          <Link href={`/w/${website.subdomain as string}`}>{website.name}</Link>
        </div>
        <SocialList socials={socials} />
        <div className="flex flex-1 justify-end">
          {!website.submissionPage.hidden && (
            <Link
              href={`/w/${website.subdomain as string}/submit`}
              className={buttonVariants({
                variant: "default",
                size: "sm",
                class: "max-w-sm px-4 py-2",
              })}
              style={{
                backgroundColor: website.colour,
              }}
            >
              Submit a story
            </Link>
          )}
        </div>
      </header>
    </>
  );
};

export default CustomerSiteHeader;
