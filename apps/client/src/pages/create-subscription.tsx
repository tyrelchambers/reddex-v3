import { useSessionStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes } from "~/routes";
import { useUserStore } from "~/stores/useUserStore";
import { api } from "~/utils/api";

const CreateSubscription = () => {
  const router = useRouter();
  const paymentLink = api.stripe.createCheckout.useMutation();
  const [selectedPlan] = useSessionStorage({
    key: "selected-plan",
  });
  const userQuery = api.user.me.useQuery();

  useEffect(() => {
    if (!userQuery.isLoading && userQuery.data) {
      const user = userQuery.data;

      if (userQuery.data.subscription) {
        router.push(routes.HOME);
      }

      const fn = async () => {
        try {
          if (!user.email || !user.customerId)
            throw new Error("Missing user email or customer id");

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
