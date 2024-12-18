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
import { Burger } from "@mantine/core";
import { useDisclosure, useViewportSize } from "@mantine/hooks";
import MobileNav from "./MobileNav";
import { breakpoints } from "~/constants";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import clsx from "clsx";

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
  sticky?: boolean;
}

const Header = ({ openDrawer, sticky = false }: Props) => {
  const session = useSession();
  const { isDark, toggleTheme } = useTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const { width } = useViewportSize();
  const router = useRouter();
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
        "right-0 top-0 z-30 mx-auto flex h-[80px] max-w-screen-2xl items-center bg-background/10 px-4 py-4 backdrop-blur-md lg:justify-between",
        opened && "h-screen !items-start overflow-hidden",
        sticky && "sticky",
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
            onClick={() => {
              trackUiEvent(MixpanelEvents.TOGGLE_THEME, {
                theme: isDark ? "dark" : "light",
              });
              toggleTheme();
            }}
            className="z-20 mr-4 lg:mr-0"
          >
            <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={clsx(isDark ? "text-gray-100" : "text-gray-700")}
            />
          </button>
          {router.pathname === routes.SEARCH && !opened && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                trackUiEvent(MixpanelEvents.OPEN_SEARCH_DRAWER);
                openDrawer?.();
              }}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-4" />
              Search
            </Button>
          )}
          <div className="flex">
            {session.data?.user && <UserMenu />}
            {session.status !== "authenticated" && (
              <Link
                href={routes.LOGIN}
                onClick={() => {
                  trackUiEvent(MixpanelEvents.GET_STARTED);
                }}
              >
                <Button type="button">Login</Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {width <= breakpoints.tablet && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => {
              trackUiEvent(MixpanelEvents.TOGGLE_THEME, {
                theme: isDark ? "dark" : "light",
              });
              toggleTheme();
            }}
            className="z-20 mr-4 lg:mr-0"
          >
            <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={clsx(isDark ? "text-gray-100" : "text-gray-700")}
            />
          </button>
          {!opened && router.pathname === routes.SEARCH && (
            <Button
              type="button"
              size="sm"
              className="mx-3"
              onClick={() => {
                trackUiEvent(MixpanelEvents.OPEN_SEARCH_DRAWER);
                openDrawer?.();
              }}
            >
              <FontAwesomeIcon
                icon={faSearch}
                className="mr-4 text-xs text-accent-foreground"
              />
              <p className="text-sm text-accent-foreground">Search</p>
            </Button>
          )}
          <MobileNav user={session.data?.user as User} />
        </div>
      )}
    </header>
  );
};

export default Header;
