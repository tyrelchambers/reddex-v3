import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import AccountSetup from "~/layouts/AccountSetup";
import CreateSubscription from "~/layouts/CreateSubscription";
import { routes } from "~/routes";
import { api } from "~/utils/api";

const Onboarding = () => {
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const router = useRouter();
  const step = Number(router.query.step);
  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const user = userQuery.data;

  useEffect(() => {
    const redirectTo = (router.query.redirectTo as string) || routes.APPROVED;
    if (user) {
      if (user.email && user.customerId) {
        router.push(redirectTo);
      } else if (!userQuery.isLoading && !userQuery.data) {
        router.push("/");
      } else if (!userQuery.isLoading && userQuery.data) {
        setLoading(false);
      }
    }
  }, [user, userQuery.data]);

  if (loading) return <LoadingScreen />;

  if (step === 1) {
    return <AccountSetup />;
  }

  if (step === 2) {
    return <CreateSubscription />;
  }

  return null;
};

export default Onboarding;
