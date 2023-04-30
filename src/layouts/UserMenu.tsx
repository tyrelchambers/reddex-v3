import { Menu } from "@mantine/core";
import React from "react";
import UserChip from "./UserChip";
import Link from "next/link";
import { routes } from "~/routes";

const UserMenu = () => {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <button type="button">
          <UserChip />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>App</Menu.Label>
        <Link href={routes.STORIES}>
          <Menu.Item>Dashboard</Menu.Item>
        </Link>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
