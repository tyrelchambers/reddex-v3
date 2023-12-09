import {
  faBolt,
  faBrowser,
  faCog,
  faHome,
  faInbox,
  faList,
  faListCheck,
  faMoneyBill,
  faRightFromBracket,
  faSearch,
  faUser,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { dashNavRoutes, routes } from "~/routes";

const commonRoutes = [
  {
    label: "Home",
    slug: routes.HOME,
    icon: faHome,
  },
  {
    label: "Search",
    slug: routes.SEARCH,
    icon: faSearch,
  },
  {
    label: "Pricing",
    slug: routes.PRICING,
    icon: faMoneyBill,
  },
];

interface Props {
  user: User | undefined;
}
const MobileNav = ({ user }: Props) => {
  const router = useRouter();

  const logoutHandler = () => {
    try {
      signOut();
      router.push(routes.HOME);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex h-full w-full flex-col overflow-y-auto bg-background">
      <section className="mt-20 px-4 pb-6">
        <nav className="flex flex-col gap-6">
          {commonRoutes.map((r) => (
            <Link
              key={r.label}
              className=" text-sm text-foreground hover:text-accent"
              href={r.slug}
            >
              <FontAwesomeIcon icon={r.icon} className="mr-2" /> {r.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-6 border-border" />

        {user ? (
          <nav className="flex flex-col gap-6">
            {dashNavRoutes.map((r) => (
              <Link
                key={r.label}
                className=" text-sm text-foreground hover:text-accent"
                href={r.slug}
              >
                <FontAwesomeIcon icon={r.icon} className="mr-2" /> {r.label}
              </Link>
            ))}

            <Separator className="my-2 border-border" />

            <Button variant="link" className="w-fit" onClick={logoutHandler}>
              <FontAwesomeIcon icon={faRightFromBracket} className="mr-4" />
              Logout
            </Button>
          </nav>
        ) : (
          <Link href={routes.LOGIN}>Login</Link>
        )}
      </section>
    </div>
  );
};

export default MobileNav;
