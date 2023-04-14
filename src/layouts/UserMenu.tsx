import { Menu, Button } from "@mantine/core";
import React from "react";
import UserChip from "./UserChip";

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
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
