import { Menu } from "@mantine/core";
import React from "react";
import UserChip from "./UserChip";
import Link from "next/link";
import { routes } from "~/routes";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

const UserMenu = () => {
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
        dropdown: "bg-card border-border",
        item: "hover:bg-card-foreground/20 text-foreground",
      }}
    >
      <Menu.Target>
        <button type="button">
          <UserChip />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>App</Menu.Label>
        <Link href={routes.INBOX}>
          <Menu.Item>Inbox</Menu.Item>
        </Link>

        <Menu.Label>Reading list</Menu.Label>
        <Link href={routes.APPROVED}>
          <Menu.Item>Approved</Menu.Item>
        </Link>

        <Link href={routes.COMPLETED}>
          <Menu.Item>Completed</Menu.Item>
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

        <Menu.Item onClick={logoutHandler}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
