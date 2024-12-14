import { faWarning } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Stripe from "stripe";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { routes, settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import SubscriptionCard from "~/components/SubscriptionCard";
import { Button } from "~/components/ui/button";
import { captureException } from "@sentry/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "~/components/ui/separator";
import AccountPlanSelectModal from "~/components/modals/AccountPlanSelectModal";
import { getPrices } from "~/constants";
import Link from "next/link";
import { toast } from "react-toastify";

const Settings = () => {
  const { data: currentUser } = api.user.me.useQuery();
  const subscriptionQuery = api.billing.info.useQuery();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const invoices = subscriptionQuery.data?.invoices;
  const paymentLink = api.stripe.createCheckout.useMutation();

  const [loadingPaymentLink, setLoadingPaymentLink] = useState(false);

  const isLoading = subscriptionQuery.isPending;

  const createSubscriptionHandler = async () => {
    try {
      setLoadingPaymentLink(true);

      if (!currentUser?.email) throw new Error("Missing email");

      const link = await paymentLink.mutateAsync({
        price: getPrices().ultimate,
        email: currentUser.email,
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

  return (
    <WrapperWithNav
      loading={isLoading}
      loadingMessage="Loading account data..."
      tabs={settingsTabs}
    >
      <section className="flex max-w-screen-sm flex-col gap-8 px-4 lg:px-0">
        <h1 className="text-3xl font-bold text-foreground">Account</h1>

        <div className="flex flex-col">
          <h2 className="text-xl font-medium text-foreground">Billing</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You can manage your subscription through Stripe. There you can
            update your billing information, cancel or update your plan.
          </p>

          {currentUser?.subscription ? (
            <SubscriptionCard
              subscription={currentUser.subscription}
              invoices={invoices}
            />
          ) : !currentUser?.subscription && !currentUser?.email ? (
            <div className="bg-warning/10 mt-6 flex items-center gap-4 rounded-md border border-yellow-500 p-4">
              <FontAwesomeIcon icon={faWarning} className="text-yellow-500" />

              <div className="flex flex-1 flex-col">
                <p className="font-medium text-foreground">
                  Your account is missing an email.
                </p>
                <p className="text-sm text-muted-foreground">
                  Before selecting a plan, please update your email.
                </p>
              </div>

              <Link
                href={routes.SETTINGS_PROFILE}
                className="bg-warning text-warning-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-yellow-600"
              >
                Add email
              </Link>
            </div>
          ) : (
            <AccountPlanSelectModal
              currentPlan={selectedPlan}
              disableSubmit={!currentUser?.email || loadingPaymentLink}
              loadingPaymentLink={loadingPaymentLink}
              setSelectedPlan={setSelectedPlan}
              createSubscriptionHandler={createSubscriptionHandler}
            />
          )}
        </div>

        <Separator className="border-border" />
        <div className="flex flex-col">
          <h2 className="text-xl text-foreground">Delete account</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            To delete your account, manage your subscription and cancel your
            membership. Your account will be deleted once your membership is
            cancelled and the billing cycle ends.
          </p>

          <Button variant="secondary">Delete account</Button>
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Settings;
