import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Social {
  url: string | null;
  icon: IconProp;
  app: string;
}
interface Props {
  socials: Social[];
}

const handleLinkHandles = ["twitter", "instagram", "tiktok"];
const buildSocialLink = (link: Social) => {
  if (handleLinkHandles.includes(link.app)) {
    return `https://www.${link.app}.com/${link.url}`;
  }
  return link.url as string;
};

const SocialList = ({ socials }: Props) => {
  return (
    <ul className="flex flex-1 items-center justify-center gap-4">
      {socials
        .filter((s) => s.url)
        .map((soc, id) => {
          return (
            <li key={`${soc.url}_${id}`}>
              <a
                href={buildSocialLink(soc)}
                className="text-foreground opacity-50 hover:opacity-100"
                target="_blank"
              >
                <FontAwesomeIcon icon={soc.icon} />
              </a>
            </li>
          );
        })}
    </ul>
  );
};

export default SocialList;
