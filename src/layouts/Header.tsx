import React from "react";
import logo from "../../public/images/reddex-dark.svg";
import logoLight from "../../public/images/reddex-light.svg";

import Image from "next/image";
import Link from "next/link";
import { routes } from "~/routes";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/pro-solid-svg-icons";
import { useTheme } from "~/hooks/useTheme";
import { clsx } from "@mantine/core";

const _routes = [
  {
    label: "Home",
    slug: "/",
  },
  { label: "Search", slug: "/search" },
  {
    label: "About",
    slug: "/about",
  },
  {
    label: "Pricing",
    slug: "/pricing",
  },
];

const Header = () => {
  const session = useSession();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="mx-auto flex max-w-screen-2xl items-center justify-between py-4">
      <div className="flex items-center">
        {isDark ? (
          <Image src={logoLight as string} alt="" className="w-12" />
        ) : (
          <Image src={logo as string} alt="" className="w-12" />
        )}
        <nav className="ml-4">
          <ul className="flex gap-4">
            {_routes.map((r) => (
              <li key={r.label} className="text-sm">
                <Link
                  href={r.slug}
                  className="text-gray-500 dark:text-gray-200"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <button type="button" onClick={toggleTheme}>
          <FontAwesomeIcon
            icon={isDark ? faSun : faMoon}
            className={clsx(isDark ? "text-gray-100" : "text-gray-700")}
          />
        </button>
        {session.status !== "loading" && (
          <div className="flex">
            {session.status === "authenticated" ? (
              <UserMenu />
            ) : (
              <Link href={routes.LOGIN} className="button main">
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
