import React, { useEffect } from "react";
import Logo from "../../public/images/reddex-dark.svg";
import LogoLight from "../../public/images/reddex-light.svg";

import Link from "next/link";
import { routes } from "~/routes";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSearch, faSun } from "@fortawesome/pro-solid-svg-icons";
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

interface Props {
  openDrawer?: () => void;
}

const Header = ({ openDrawer }: Props) => {
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
        "sticky right-0 top-0 z-30 mx-auto flex max-w-screen-2xl items-center bg-background px-4 py-4 lg:relative lg:justify-between xl:px-0",
        opened && " h-screen !items-start overflow-hidden"
      )}
    >
      <div className="flex flex-1 items-center">
        {isDark ? (
          <LogoLight alt="" className="z-0 w-12" />
        ) : (
          <Logo alt="" className="z-0 w-12" />
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
          {!opened && (
            <button
              type="button"
              onClick={openDrawer}
              className="flex items-center justify-center rounded-full bg-accent px-3 py-2 shadow-sm"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="mr-2 text-xs text-accent-foreground"
              />
              <p className="text-sm text-accent-foreground">Search</p>
            </button>
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
          {!opened && (
            <button
              type="button"
              onClick={openDrawer}
              className="mr-4 flex items-center justify-center rounded-full bg-accent px-3 py-2 shadow-sm"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="mr-2 text-xs text-accent-foreground"
              />
              Search
            </button>
          )}
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
