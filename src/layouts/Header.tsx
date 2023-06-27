import React, { useEffect } from "react";
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
import { Burger, clsx } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import MobileNav from "./MobileNav";
import { breakpoints } from "~/constants";
import { User } from "@prisma/client";

const _routes = [
  {
    label: "Home",
    slug: routes.HOME,
  },
  { label: "Search", slug: routes.SEARCH },
  {
    label: "Pricing",
    slug: routes.PRICING,
  },
];

const Header = () => {
  const session = useSession();
  const { isDark, toggleTheme } = useTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { width } = useViewportSize();

  const label = opened ? "Close navigation" : "Open navigation";

  useEffect(() => {
    const body = document.body;
    if (opened) {
      body.style.height = "0px";
      body.style.overflow = "hidden";
    } else {
      body.style.height = "auto";
      body.style.overflow = "auto";
    }
  }, [opened]);

  return (
    <header
      className={clsx(
        "sticky right-0 top-0 z-30 mx-auto flex max-w-screen-2xl items-center bg-background px-4 py-4 lg:relative lg:justify-between lg:px-0",
        opened && " h-screen !items-start overflow-hidden"
      )}
    >
      <div className="flex flex-1 items-center">
        {isDark ? (
          <Image src={logoLight as string} alt="" className="z-0 w-12" />
        ) : (
          <Image src={logo as string} alt="" className="z-0 w-12" />
        )}
        {width > breakpoints.tablet && (
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
        )}
      </div>

      {width > breakpoints.tablet && (
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={toggleTheme}
            className="z-20 mr-4 lg:mr-0"
          >
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
      )}

      {width <= breakpoints.tablet && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className="z-20 mr-4 lg:mr-0"
          >
            <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={clsx(isDark ? "text-gray-100" : "text-gray-700")}
            />
          </button>
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label={label}
            className="relative z-20 "
            color={isDark ? "white" : "black"}
          />
        </div>
      )}
      {opened && <MobileNav user={session.data?.user as User} />}
    </header>
  );
};

export default Header;
