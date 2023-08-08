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
  const [step, setStep] = useState<string | undefined>(
    (router.query.step as string) ?? undefined
  );
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

  useEffect(() => {
    if (!step) {
      setStep("1");
      router.push(routes.ONBOARDING, {
        query: {
          step: "1",
        },
      });
    }
  }, [step, router.isReady]);

  if (loading) return <LoadingScreen />;

  if (step == "1") {
    return <AccountSetup setStep={setStep} />;
  }

  if (step == "2") {
    return <CreateSubscription />;
  }

  return null;
};

export default Onboarding;
