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
        dropdown: "bg-muted border-border",
        item: "hover:bg-muted-foreground/20 text-foreground",
      }}
    >
      <Menu.Target>
        <button type="button">
          <UserChip />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>App</Menu.Label>
        <Link href={routes.APPROVED}>
          <Menu.Item>Dashboard</Menu.Item>
        </Link>
        <Menu.Divider className="border-border" />
        <button type="button" onClick={logoutHandler} className="w-full">
          <Menu.Item>Logout</Menu.Item>
        </button>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
