import React, { useState } from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { routes, settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import SubscriptionCard from "~/components/SubscriptionCard";
import { captureException } from "@sentry/nextjs";
import { Separator } from "~/components/ui/separator";
import AccountPlanSelectModal from "~/components/modals/AccountPlanSelectModal";
import { getPrices } from "~/constants";
import AccountDeletionBanner from "~/components/AccountDeletionBanner";
import CancelAccountDeletionBanner from "~/components/CancelAccountDeletionBanner";
import { toast } from "sonner";
import { useRouter } from "next/router";
import DashboardSection from "~/layouts/DashboardSection";

const Settings = () => {
  const router = useRouter();
  const apiCtx = api.useUtils();
  const { data: currentUser } = api.user.me.useQuery();
  const subscriptionQuery = api.billing.info.useQuery();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const invoices = subscriptionQuery.data?.invoices;
  const paymentLink = api.stripe.createCheckout.useMutation();
  const deleteMutation = api.user.deleteAccount.useMutation({
    onSuccess: async (data) => {
      if (!("scheduled" in data)) {
        await apiCtx.user.me.invalidate();
        toast.success("Account deleted");
        router.push(routes.HOME);
      }
    },
  });
  const cancelDeletionMutation = api.user.cancelDeletion.useMutation();

  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);

  const isLoading = subscriptionQuery.isPending;

  const createSubscriptionHandler = async () => {
    try {
      setLoadingPaymentLink(true);

      const link = await paymentLink.mutateAsync({
        price: getPrices().ultimate,
        email: currentUser?.email,
      });

      if (link) {
        window.open(link, "_self", "rel=noopener,noreferrer");
        window.sessionStorage.removeItem("selected-plan");
      } else {
        throw new Error("Missing payment link");
      }

      setLoadingPaymentLink(false);
    } catch (error) {
      setLoadingPaymentLink(false);
      toast.error("Something went wrong");
      captureException(error, {
        extra: {
          userId: currentUser?.id,
          plan: selectedPlan,
        },
      });
    }
  };

  const deleteHandler = () =>
    deleteMutation.mutate(undefined, {
      onSuccess: async () => {
        await apiCtx.user.me.invalidate();
      },
    });

  const cancelHandler = () =>
    cancelDeletionMutation.mutate(undefined, {
      onSuccess: async () => {
        await apiCtx.user.me.invalidate();
      },
    });

  return (
    <WrapperWithNav
      loading={isLoading}
      loadingMessage="Loading account data..."
      tabs={settingsTabs}
    >
      <section className="flex max-w-screen-sm flex-col gap-8 px-4 lg:px-0">
        <h1 className="text-3xl font-bold text-foreground">Account</h1>

        <DashboardSection
          title="Billing details"
          subtitle="You can manage your subscription through Stripe. There you can
              update your billing information, cancel or update your plan."
        >
          {currentUser?.subscription ? (
            <SubscriptionCard
              subscription={currentUser.subscription}
              invoices={invoices}
            />
          ) : (
            <AccountPlanSelectModal
              currentPlan={selectedPlan}
              disableSubmit={!selectedPlan}
              loadingPaymentLink={loadingPaymentLink}
              setSelectedPlan={setSelectedPlan}
              createSubscriptionHandler={createSubscriptionHandler}
            />
          )}
        </DashboardSection>

        <Separator className="border-border" />
        {currentUser?.deleteOnDate ? (
          <CancelAccountDeletionBanner cancelHandler={cancelHandler} />
        ) : (
          <AccountDeletionBanner deleteHandler={deleteHandler} />
        )}
      </section>
    </WrapperWithNav>
  );
};

export default Settings;
