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
      className="sticky flex w-full flex-row gap-2 overflow-x-auto rounded-lg bg-card p-1 text-sm lg:flex-col xl:top-36"
    >
      {tabs.map((item, idx) => (
        <li
          key={idx}
          className={`rounded-md ${
            router.pathname.includes(item.slug)
              ? "bg-background text-foreground"
              : "text-gray-500"
          }`}
        >
          <Link
            aria-selected={router.pathname.includes(item.slug)}
            aria-controls={`tabpanel-${idx + 1}`}
            className="flex items-center gap-x-2 whitespace-nowrap rounded-md px-2 py-2 font-medium duration-150 hover:bg-background hover:text-foreground"
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
