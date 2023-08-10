import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingScreen from "~/components/LoadingScreen";
import AccountSetup from "~/layouts/AccountSetup";
import { routes } from "~/routes";
import { api } from "~/utils/api";

const Onboarding = () => {
  const [loading, setLoading] = useState(true);

  const session = useSession();
  const router = useRouter();

  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const user = userQuery.data;

  useEffect(() => {
    const redirectTo = (router.query.redirectTo as string) || routes.APPROVED;
    if (user) {
      if (
        user.email &&
        user.customerId &&
        user.subscription?.status === "active"
      ) {
        router.push(redirectTo);
      } else if (!userQuery.isLoading && !userQuery.data) {
        router.push("/");
      } else if (!userQuery.isLoading && userQuery.data) {
        setLoading(false);
      }
    }
  }, [user, userQuery.data]);

  if (loading) return <LoadingScreen />;

  return <AccountSetup />;
};

export default Onboarding;
