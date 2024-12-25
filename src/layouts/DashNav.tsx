import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { dashNavRoutes } from "~/routes";

const DashNav = () => {
  const pathname = useRouter().pathname;

  const pathRoot = pathname.split("/")[2];

  return (
    <nav className="hidden w-full justify-start overflow-x-auto bg-foreground/5 p-3 xl:flex">
      <ul className="mx-auto flex w-full max-w-screen-2xl gap-8 px-4 text-sm text-gray-500">
        {dashNavRoutes.map((r) => (
          <li key={r.label}>
            <Link
              href={r.slug}
              className={`flex items-center gap-2 hover:text-accent ${
                pathRoot === r.label.toLowerCase()
                  ? "text-foreground"
                  : "text-foreground/50"
              }`}
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
