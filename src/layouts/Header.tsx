import React from "react";
import Logo from "../../public/images/reddex-dark.svg";
import LogoLight from "../../public/images/reddex-light.svg";

import Link from "next/link";
import { routes } from "~/routes";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/pro-solid-svg-icons";
import { useTheme } from "~/hooks/useTheme";
import MobileNav from "./MobileNav";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import clsx from "clsx";
import SearchModal from "~/components/modals/SearchModal";

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
  sticky?: boolean;
}

const Header = ({ sticky = false }: Props) => {
  const session = useSession();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <header
      className={clsx(
        "sticky right-0 top-0 z-30 mx-auto flex h-[80px] items-center bg-background px-4 py-4 lg:justify-between",
        sticky && "sticky",
      )}
    >
      <div className="mx-auto flex w-full max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center">
          {isDark ? (
            <LogoLight alt="" className="z-0 w-12" />
          ) : (
            <Logo alt="" className="z-0 w-12" />
          )}
          <nav className="ml-4 hidden items-center xl:flex">
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

        <div className="hidden items-center gap-6 xl:flex">
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
          {router.pathname === routes.SEARCH && <SearchModal />}
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

        <div className="flex items-center gap-8 xl:hidden">
          <button
            type="button"
            onClick={() => {
              trackUiEvent(MixpanelEvents.TOGGLE_THEME, {
                theme: isDark ? "dark" : "light",
              });
              toggleTheme();
            }}
            className="z-20"
          >
            <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={clsx(isDark ? "text-gray-100" : "text-gray-700")}
            />
          </button>
          {router.pathname === routes.SEARCH && <SearchModal />}
          <MobileNav user={session.data?.user as User} />
        </div>
      </div>
    </header>
  );
};

export default Header;
