import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Tab } from "~/types";

interface Props {
  tabs: Tab[];
  query?: string;
  route: string;
}

const TabsList = ({ tabs, query = "tab", route }: Props) => {
  const router = useRouter();

  return (
    <ul role="tablist" className="flex w-fit flex-col gap-4 text-sm">
      {tabs.map((item, idx) => (
        <li
          key={idx}
          className={`rounded-lg ${
            item.slug === router.query[query]
              ? "bg-gray-50 text-indigo-600"
              : " text-gray-500"
          }`}
        >
          <Link
            aria-selected={item.slug === query ? true : false}
            aria-controls={`tabpanel-${idx + 1}`}
            className="flex items-center gap-x-2 rounded-lg px-2 py-2 font-medium duration-150 hover:bg-gray-50 hover:text-indigo-600 active:bg-gray-100"
            href={`${route}/?tab=${item.slug}`}
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
