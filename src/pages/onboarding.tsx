import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import { getPrices } from "~/constants";
import AccountSetup from "~/layouts/AccountSetup";
import { routes } from "~/routes";
import { hasActiveSubscription, isActiveSubscription } from "~/utils";
import { api } from "~/utils/api";

const Onboarding = () => {
  const session = useSession();
  const router = useRouter();

  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const checkoutMutation = api.stripe.createCheckout.useMutation();
  const user = userQuery.data;

  const loading = userQuery.isLoading;

  useEffect(() => {
    const redirectTo = (router.query.redirectTo as string) || routes.HOME;
    const plan = router.query.plan as string;

    const fn = async () => {
      if (user) {
        if (
          user.email &&
          user.subscription &&
          isActiveSubscription(user.subscription)
        ) {
          router.push(redirectTo);
        }
        if (plan && !user.subscription) {
          const link = await checkoutMutation.mutateAsync({
            price: getPrices()[plan] ?? "",
            email: user.email ?? undefined,
          });

          if (link) {
            window.open(link, "_self", "rel=noopener,noreferrer");
          }
        }
      }
    };

    fn();
  }, [user, userQuery.data, router.isReady]);

  if (loading) return <LoadingScreen />;

  return <AccountSetup />;
};

export default Onboarding;
