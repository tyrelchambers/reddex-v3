import {
  faBrowser,
  faCog,
  faInbox,
  faLayerGroup,
  faTag,
  faUser,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { routes } from "~/routes";

const _routes = [
  {
    label: "Stories",
    slug: routes.APPROVED,
    icon: faLayerGroup,
  },
  {
    label: "Tags",
    slug: routes.TAGS,
    icon: faTag,
  },
  {
    label: "Contacts",
    slug: routes.CONTACTS,
    icon: faUser,
  },
  {
    label: "Inbox",
    slug: routes.INBOX,
    icon: faInbox,
  },
  {
    label: "Website",
    slug: routes.WEBSITE,
    icon: faBrowser,
  },
  {
    label: "Settings",
    slug: routes.SETTINGS,
    icon: faCog,
  },
];

const DashNav = () => {
  return (
    <nav className=" w-full bg-gray-100 p-3">
      <ul className="mx-auto flex max-w-screen-2xl gap-8 text-sm text-gray-500">
        {_routes.map((r) => (
          <li key={r.label}>
            <Link
              href={r.slug}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-500"
            >
              <FontAwesomeIcon icon={r.icon} />
              <p>{r.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashNav;
