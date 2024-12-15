import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Tab } from "~/types";

interface Props {
  tabs: Tab[];
}

const TabsList = ({ tabs }: Props) => {
  const router = useRouter();

  return (
    <ul
      role="tablist"
      className="sticky top-4 flex w-full flex-row overflow-x-auto text-sm lg:flex-col"
    >
      {tabs.map((item, idx) => (
        <li
          key={idx}
          className={`rounded-lg ${
            router.pathname.includes(item.slug)
              ? "bg-card text-foreground"
              : "text-gray-500"
          }`}
        >
          <Link
            aria-selected={router.pathname.includes(item.slug)}
            aria-controls={`tabpanel-${idx + 1}`}
            className="flex items-center gap-x-2 whitespace-nowrap rounded-lg px-2 py-2 font-medium duration-150 hover:bg-card hover:text-foreground"
            href={item.slug}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TabsList;
