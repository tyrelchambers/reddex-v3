import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { env } from "~/env.mjs";
import { routes } from "~/routes";
import { api } from "~/utils/api";

const SubscriptionCheck = () => {
  const router = useRouter();
  const userQuery = api.user.me.useQuery();

  useEffect(() => {
    if (userQuery.data?.Subscription?.selectedPlan) {
      router.push(routes.APPROVED);
    } else {
      router.push(env.NEXT_PUBLIC_STRIPE_BILLING_PORTAL_TEST_LINK);
    }
  }, [userQuery.data]);

  return null;
};

export default SubscriptionCheck;
