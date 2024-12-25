import {
  faTwitter,
  faInstagram,
  faYoutube,
  faPatreon,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-regular-svg-icons";
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
    },
    {
      url: website.instagram,
      icon: faInstagram,
    },
    {
      url: website.youtube,
      icon: faYoutube,
    },
    {
      url: website.patreon,
      icon: faPatreon,
    },
    {
      url: website.podcast,
      icon: faPodcast,
    },
    {
      url: website.facebook,
      icon: faFacebook,
    },
  ];

  return (
    <>
      <div
        className="h-[5px] w-full"
        style={{ backgroundColor: website.colour }}
      ></div>
      <header className="flex flex-col items-center justify-between gap-2 bg-card p-4 sm:flex-row">
        <div className="flex items-center text-xl text-foreground">
          {website.thumbnail && (
            <Image
              src={website.thumbnail}
              width={50}
              height={50}
              alt=""
              className="mr-2 rounded-md"
            />
          )}
          <Link href={`/${website.subdomain as string}`}>{website.name}</Link>
        </div>
        <SocialList socials={socials} />
        {!website.submissionPage.hidden && (
          <Link
            href={`/${website.subdomain as string}/submit`}
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
      </header>
    </>
  );
};

export default CustomerSiteHeader;
