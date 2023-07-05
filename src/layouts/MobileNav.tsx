import { faRightFromBracket } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@mantine/core";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { routes } from "~/routes";

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
      <section className="mt-20 px-8">
        <nav className="flex flex-col gap-4">
          <Link
            className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
            href={routes.HOME}
          >
            Home
          </Link>

          <Link
            className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
            href={routes.SEARCH}
          >
            Search
          </Link>

          <Link
            className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
            href={routes.PRICING}
          >
            Pricing
          </Link>
        </nav>

        <Divider className="my-6 border-border" />

        {user ? (
          <nav className="flex flex-col gap-4">
            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.APPROVED}
            >
              Approved
            </Link>

            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.COMPLETED}
            >
              Completed
            </Link>

            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.INBOX}
            >
              Inbox
            </Link>

            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.WEBSITE_GENERAL}
            >
              Website
            </Link>

            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.SETTINGS_PROFILE}
            >
              Profile
            </Link>

            <Link
              className="rounded-md border-[1px] border-border p-2 text-sm text-foreground"
              href={routes.SETTINGS_ACCOUNT}
            >
              Account
            </Link>

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
