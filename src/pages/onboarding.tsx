import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getPrices } from "~/constants";
import { routes } from "~/routes";
import { isActiveSubscription } from "~/utils";
import { api } from "~/utils/api";

const Onboarding = () => {
  const session = useSession();
  const router = useRouter();

  const userQuery = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const checkoutMutation = api.stripe.createCheckout.useMutation();
  const user = userQuery.data;

  useEffect(() => {
    const redirectTo = (router.query.redirectTo as string) || routes.HOME;
    const plan = router.query.plan as string;

    const fn = async () => {
      if (user) {
        if (user.subscription && isActiveSubscription(user.subscription)) {
          router.push(redirectTo);
        }

        if (plan && !user.subscription) {
          const link = await checkoutMutation.mutateAsync({
            price: getPrices().ultimate,
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

  return null;
};

export default Onboarding;
