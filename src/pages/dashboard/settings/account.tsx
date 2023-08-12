import { faExternalLink } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import React, { useState } from "react";
import Stripe from "stripe";
import InvoicesList from "~/components/InvoicesList";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses, mantineModalClasses } from "~/lib/styles";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import SubscriptionCard from "~/components/SubscriptionCard";
import NoSelectedPlan from "~/components/NoSelectedPlan";
import { Button } from "~/components/ui/button";
import { isNotEmpty, useForm } from "@mantine/form";
import { useUserStore } from "~/stores/useUserStore";
import { captureException } from "@sentry/nextjs";

const Settings = () => {
  const currentUser = useUserStore();
  const subscriptionQuery = api.billing.info.useQuery();
  const [selectedFrequency, setSelectedFrequency] = useState<
    "yearly" | "monthly"
  >("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const subscription = subscriptionQuery.data?.customer.subscriptions
    ?.data[0] as Stripe.Subscription & {
    plan: Stripe.Plan & {
      product: Stripe.Product;
    };
  };
  const invoices = subscriptionQuery.data?.invoices;
  const paymentLink = api.stripe.createCheckout.useMutation();
  const createCustomer = api.billing.createCustomer.useMutation();

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: isNotEmpty(),
    },
  });

  const isLoading = subscriptionQuery.isLoading;

  const createSubscriptionHandler = async () => {
    try {
      const { hasErrors } = form.validate();

      if (hasErrors) {
        return;
      }

      const customerEmail = currentUser.user?.email || form.values.email;

      const customerId =
        currentUser.user?.customerId ||
        (await createCustomer.mutateAsync(customerEmail));

      if (!customerId) {
        throw new Error("Missing customer ID");
      }

      if (!selectedPlan) throw new Error("Missing selected plan");

      const link = await paymentLink.mutateAsync({
        customerEmail,
        plan: selectedPlan,
        customerId,
      });

      if (link) {
        window.open(link, "_self", "rel=noopener,noreferrer");
        window.sessionStorage.removeItem("selected-plan");
      } else {
        throw new Error("Missing payment link");
      }
    } catch (error) {
      captureException(error, {
        extra: {
          userId: currentUser.user?.id,
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
        <h1 className="text-3xl text-foreground">Account</h1>

        <div className="flex flex-col">
          <h2 className=" text-xl text-foreground">Billing</h2>
          <p className=" text-sm text-muted-foreground">
            Your plan is managed with Stripe.
          </p>

          <p className="mt-2 text-sm font-thin text-muted-foreground">
            You can manage your subscription through Stripe. There you can
            update your billing information, cancel or update your plan.
          </p>

          {subscription ? (
            <SubscriptionCard
              subscription={subscription}
              open={open}
              invoices={invoices}
            />
          ) : (
            <div className="mt-4 rounded-xl border-[1px] border-border p-4">
              <p className="mb-4">
                Please add an email to your account before we proceed.
              </p>
              <TextInput
                label="Email"
                placeholder="Email"
                required
                type="email"
                classNames={mantineInputClasses}
                {...form.getInputProps("email")}
              />
              <NoSelectedPlan
                setSelectedPlanHandler={setSelectedPlan}
                frequency={selectedFrequency}
                setFrequency={setSelectedFrequency}
                selectedPlan={selectedPlan}
              />

              <Button
                disabled={!selectedPlan || !form.values.email}
                className="w-full"
                onClick={createSubscriptionHandler}
              >
                Setup subscription
              </Button>
            </div>
          )}
        </div>

        <Divider className="border-border" />
        <div className="flex flex-col">
          <h2 className=" text-xl text-foreground">Delete account</h2>
          <p className="text-sm text-muted-foreground">
            To delete your account, manage your subscription and cancel your
            membership. Your account will be deleted once your membership is
            cancelled and the billing cycle ends.
          </p>
        </div>
      </section>

      <Modal
        opened={opened}
        onClose={close}
        title="Invoices"
        size="xl"
        classNames={mantineModalClasses}
      >
        <Link
          href="https://dashboard.stripe.com/invoices"
          className="text-sm text-accent underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View all invoices{" "}
          <FontAwesomeIcon className="ml-2" icon={faExternalLink} />
        </Link>
        {invoices && <InvoicesList invoices={invoices.data} />}
      </Modal>
    </WrapperWithNav>
  );
};

export default Settings;
