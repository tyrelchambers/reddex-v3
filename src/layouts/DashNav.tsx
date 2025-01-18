import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { dashNavRoutes } from "~/routes";

const DashNav = () => {
  const pathname = useRouter().pathname;

  const pathRoot = pathname.split("/")[2];

  return (
    <nav className="z-20 hidden w-full justify-start overflow-x-auto bg-card xl:sticky xl:top-20 xl:flex">
      <ul className="mx-auto flex w-full max-w-screen-2xl gap-8 px-4 text-sm text-gray-500">
        {dashNavRoutes.map((r) => (
          <li key={r.label}>
            <Link
              href={r.slug}
              className={`flex items-center gap-2 px-2 py-3 hover:text-accent ${
                pathRoot === r.label.toLowerCase()
                  ? "border-b-2 border-accent text-primary"
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
