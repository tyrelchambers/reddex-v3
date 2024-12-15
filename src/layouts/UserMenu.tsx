import React from "react";
import { dashNavRoutes, routes } from "~/routes";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const UserMenu = () => {
  const session = useSession();
  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const user = userQuery.data;
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-foreground underline hover:text-accent"
          onClick={() => trackUiEvent(MixpanelEvents.OPEN_USER_MENU)}
        >
          {user?.name}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {dashNavRoutes.map((r) => (
          <DropdownMenuItem key={r.label} onClick={() => router.push(r.slug)}>
            <FontAwesomeIcon icon={r.icon} className="mr-2" /> {r.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="border-border" />

        <DropdownMenuItem
          onClick={() => {
            trackUiEvent(MixpanelEvents.LOGOUT);
            logoutHandler();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
