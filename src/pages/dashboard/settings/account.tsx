import {
  faReceipt,
  faSquareArrowUpRight,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Divider, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import React from "react";
import InvoicesList from "~/components/InvoicesList";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineModalClasses } from "~/lib/styles";
import { settingsTabs } from "~/routes";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatStripeTime } from "~/utils/formatStripeTime";

const Settings = () => {
  const subscriptionQuery = api.billing.info.useQuery();
  const updateLink = api.billing.updateLink.useQuery();

  const subscription = subscriptionQuery.data?.subscription;
  const invoices = subscriptionQuery.data?.invoices;
  const [opened, { open, close }] = useDisclosure(false);

  const isLoading = subscriptionQuery.isLoading;

  return (
    <WrapperWithNav
      loading={isLoading}
      loadingMessage="Loading account data..."
      tabs={settingsTabs}
    >
      <section className="flex max-w-screen-sm flex-col gap-8">
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

          <div className="mt-4 flex flex-col gap-2 rounded-xl border-[1px] border-border p-4">
            <header className="flex justify-between text-card-foreground">
              <p className="text-sm">
                <span className="font-semibold">Your plan:</span>{" "}
                {subscription?.plan.product.name}
              </p>

              <p className="text-sm font-semibold text-card-foreground">
                {formatCurrency(
                  subscription?.plan.amount,
                  subscription?.plan.currency
                )}
                <span className="text-sm font-thin text-card-foreground/60">
                  /{subscription?.plan.interval}
                </span>
              </p>
            </header>
            {subscription?.current_period_end && (
              <p className="text-sm text-card-foreground/60">
                <span className="font-semibold text-card-foreground">
                  Next invoice:
                </span>{" "}
                {formatCurrency(
                  subscription?.plan.amount,
                  subscription?.plan.currency
                )}{" "}
                on {formatStripeTime(subscription.current_period_end)}
              </p>
            )}
            <Badge
              variant="dot"
              className="my-2 w-fit text-foreground"
              color="green"
            >
              {subscription?.status === "active" ? "active" : "inactive"}
            </Badge>

            <footer className="mt-2 flex justify-end gap-4 border-t-[1px] border-t-border pt-3">
              {invoices && (
                <Button variant="ghost" onClick={open}>
                  View invoices{" "}
                  <FontAwesomeIcon icon={faReceipt} className="ml-2" />
                </Button>
              )}
              {updateLink.data && (
                <Link
                  href={updateLink.data}
                  className="flex-1 rounded-lg border-[1px] border-background bg-accent px-6 py-2 text-center text-sm  text-accent-foreground hover:bg-accent/80"
                  target="_blank"
                >
                  Manage subscription{" "}
                  <FontAwesomeIcon
                    icon={faSquareArrowUpRight}
                    className="ml-2"
                  />
                </Link>
              )}
            </footer>
          </div>
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
        {invoices && <InvoicesList invoices={invoices.data} />}
      </Modal>
    </WrapperWithNav>
  );
};

export default Settings;
