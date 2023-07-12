import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { routeWhitelist, routes } from "~/routes";
import { useUserStore } from "~/stores/useUserStore";
import { hasActiveSubscription } from "~/utils";

export const useSubscribed = () => {
  const userStore = useUserStore();
  const router = useRouter();
  const activeSub = hasActiveSubscription(userStore.user);
  const isOnAllowedRoute = routeWhitelist.includes(router.asPath);

  useEffect(() => {
    if (router.isReady && !activeSub && !isOnAllowedRoute) {
      router.push(routes.SETTINGS_ACCOUNT);
      toast.warn("You must be subscribed to continue");
    }
  }, [userStore.user, router.isReady]);

  return {
    activeSub,
    isOnAllowedRoute,
  };
};
