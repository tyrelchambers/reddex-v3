import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Tab } from "~/types";

interface Props {
  tabs: Tab[];
  route: string;
}

const TabsList = ({ tabs, route }: Props) => {
  const router = useRouter();

  return (
    <ul
      role="tablist"
      className="sticky top-4 flex w-fit flex-col gap-4 text-sm"
    >
      {tabs.map((item, idx) => (
        <li
          key={idx}
          className={`rounded-lg ${
            router.pathname.includes(item.slug)
              ? "bg-gray-50 text-indigo-600"
              : " text-gray-500"
          }`}
        >
          <Link
            aria-selected={router.pathname.includes(item.slug)}
            aria-controls={`tabpanel-${idx + 1}`}
            className="flex items-center gap-x-2 rounded-lg px-2 py-2 font-medium duration-150 hover:bg-gray-50 hover:text-indigo-600 active:bg-gray-100"
            href={`${route}/${item.slug}`}
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
