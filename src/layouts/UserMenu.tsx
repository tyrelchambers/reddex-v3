import { Menu } from "@mantine/core";
import React from "react";
import Link from "next/link";
import { dashNavRoutes, routes } from "~/routes";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      width={300}
      classNames={{
        dropdown: "bg-background border-border",
        item: "hover:bg-card-foreground/10 text-foreground",
      }}
      position="bottom-end"
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
        {dashNavRoutes.map((r) => (
          <Menu.Item key={r.label} onClick={() => router.push(r.slug)}>
            <FontAwesomeIcon icon={r.icon} className="mr-2" /> {r.label}
          </Menu.Item>
        ))}

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
