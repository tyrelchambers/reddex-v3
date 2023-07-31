import { useRouter } from "next/router";
import { useEffect } from "react";
import { routes } from "~/routes";
import { api } from "~/utils/api";

const CreateSubscription = () => {
  const router = useRouter();
  const paymentLink = api.stripe.createCheckout.useMutation();

  const userQuery = api.user.me.useQuery();

  useEffect(() => {
    if (!userQuery.isLoading && userQuery.data) {
      const user = userQuery.data;

      if (userQuery.data.subscription) {
        router.push(routes.HOME);
      }

      const fn = async () => {
        const selectedPlan = new URLSearchParams(window.location.search).get(
          "plan"
        );
        try {
          if (!user.email || !user.customerId)
            throw new Error("Missing user email or customer id");

          if (!selectedPlan) return router.push(routes.PRICING);

          const link = await paymentLink.mutateAsync({
            customerEmail: user.email,
            plan: selectedPlan,
            customerId: user.customerId,
          });
          if (link) {
            window.open(link, "_self", "rel=noopener,noreferrer");
            window.sessionStorage.removeItem("selected-plan");
          }
        } catch (error) {
          console.log(error);
        }
      };

      fn();
    }
  }, [userQuery.data]);

  return null;
};

export default CreateSubscription;