import Link from "next/link";
import React from "react";
import { routes } from "~/routes";

const _routes = [
  {
    label: "Approved",
    slug: routes.DASHBOARD,
  },
  {
    label: "Completed",
    slug: routes.COMPLETED,
  },
  {
    label: "Submitted",
    slug: routes.SUBMITTED,
  },
  {
    label: "Tags",
    slug: routes.TAGS,
  },
  {
    label: "Contacts",
    slug: routes.CONTACTS,
  },
  {
    label: "Inbox",
    slug: routes.INBOX,
  },
  {
    label: "Website",
    slug: routes.WEBSITE,
  },
  {
    label: "Settings",
    slug: routes.SETTINGS,
  },
];

const DashNav = () => {
  return (
    <nav className=" w-full bg-gray-100 p-3">
      <ul className="mx-auto flex max-w-screen-2xl gap-4 text-gray-500">
        {_routes.map((r) => (
          <li key={r.label}>
            <Link href={r.slug} className="hover:text-indigo-500">
              {r.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashNav;
