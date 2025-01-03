import {
  faBars,
  faHome,
  faMoneyBill,
  faRightFromBracket,
  faSearch,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
    <Sheet>
      <SheetTrigger className="flex items-center">
        <FontAwesomeIcon icon={faBars} className="text-xl text-foreground" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2">
          {commonRoutes.map((r) => (
            <Link
              key={r.label}
              className="rounded-sm bg-card/50 p-2 text-sm text-foreground hover:text-accent"
              href={r.slug}
            >
              <FontAwesomeIcon icon={r.icon} className="mr-2" /> {r.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-6 border-border" />

        {user ? (
          <nav className="flex flex-col gap-2">
            {dashNavRoutes.map((r) => (
              <Link
                key={r.label}
                className="rounded-sm bg-card/50 p-2 text-sm text-foreground hover:text-accent"
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
