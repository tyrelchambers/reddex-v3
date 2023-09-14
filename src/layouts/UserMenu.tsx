import { Menu } from "@mantine/core";
import React from "react";
import Link from "next/link";
import { routes } from "~/routes";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";

const UserMenu = () => {
  const session = useSession();
  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const user = userQuery?.data;
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
    <Menu
      shadow="md"
      width={200}
      classNames={{
        dropdown: "bg-background border-border",
        item: "hover:bg-card-foreground/10 text-foreground",
      }}
    >
      <Menu.Target>
        <button
          type="button"
          className="text-foreground underline hover:text-accent"
          onClick={() => trackUiEvent(MixpanelEvents.OPEN_USER_MENU)}
        >
          {user?.name}
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Reading list</Menu.Label>
        <Link href={routes.APPROVED}>
          <Menu.Item>Approved</Menu.Item>
        </Link>

        <Link href={routes.COMPLETED}>
          <Menu.Item>Completed</Menu.Item>
        </Link>

        <Link href={routes.SUBMITTED}>
          <Menu.Item>Submitted</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />
        <Menu.Label>Tags</Menu.Label>

        <Link href={routes.TAGS}>
          <Menu.Item>Tags</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />

        <Menu.Label>Contacts</Menu.Label>

        <Link href={routes.CONTACTS}>
          <Menu.Item>Contacts</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />

        <Menu.Label>Inbox</Menu.Label>
        <Link href={routes.INBOX}>
          <Menu.Item>Inbox</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />

        <Menu.Label>Website</Menu.Label>
        <Link href={routes.WEBSITE_GENERAL}>
          <Menu.Item>Website</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />

        <Menu.Label>Settings</Menu.Label>
        <Link href={routes.SETTINGS_PROFILE}>
          <Menu.Item>Profile</Menu.Item>
        </Link>

        <Link href={routes.SETTINGS_ACCOUNT}>
          <Menu.Item>Account</Menu.Item>
        </Link>

        <Menu.Divider className="border-border" />

        <Menu.Item
          onClick={() => {
            trackUiEvent(MixpanelEvents.LOGOUT);
            logoutHandler();
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
