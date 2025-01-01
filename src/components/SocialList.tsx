import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Props {
  socials: Partial<{
    url: string | null;
    icon: IconProp | undefined;
  }>[];
}

const SocialList = ({ socials }: Props) => {
  return (
    <ul className="flex flex-1 items-center justify-center gap-4">
      {socials.map((soc, id) => {
        if (soc.icon && soc.url) {
          return (
            <li key={`${soc.url}_${id}`}>
              <a
                href={soc.url}
                className="text-foreground opacity-50 hover:opacity-100"
              >
                <FontAwesomeIcon icon={soc.icon} />
              </a>
            </li>
          );
        }
      })}
    </ul>
  );
};

export default SocialList;
