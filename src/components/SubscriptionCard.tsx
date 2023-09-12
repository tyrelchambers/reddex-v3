import {
  faReceipt,
  faSquareArrowUpRight,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@mantine/core";
import React from "react";
import Stripe from "stripe";
import { formatCurrency, formatStripeTime } from "~/utils";
import { api } from "~/utils/api";
import { Button } from "./ui/button";

interface Props {
  subscription: Stripe.Subscription & {
    plan: Stripe.Plan & {
      product: Stripe.Product;
    };
  };
  open: () => void;
  invoices: Stripe.ApiList<Stripe.Invoice> | undefined;
}

const SubscriptionCard = ({ subscription, open, invoices }: Props) => {
  const updateLink = api.billing.updateLink.useMutation({
    onSuccess: (res) => {
      if (res) {
        window.open(res, "_blank");
      }
    },
  });

  return (
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
      <p className="break-all text-sm text-card-foreground/60">
        <span className="font-semibold text-card-foreground">
          Subscription ID:
        </span>{" "}
        {subscription?.id}
      </p>
      <Badge variant="dot" className="my-2 w-fit text-foreground" color="green">
        {subscription?.status === "active" ||
        subscription?.status === "trialing"
          ? "active"
          : "inactive"}
      </Badge>

      <footer className="mt-2 flex flex-col justify-end gap-4 border-t-[1px] border-t-border pt-3 md:flex-row">
        {invoices && (
          <Button variant="ghost" onClick={open}>
            View invoices <FontAwesomeIcon icon={faReceipt} className="ml-2" />
          </Button>
        )}
        <button
          className="flex-1 rounded-lg border-[1px] border-background bg-accent px-6 py-2 text-center text-sm  text-accent-foreground hover:bg-accent/80"
          type="button"
          onClick={() => updateLink.mutate()}
        >
          Manage subscription{" "}
          <FontAwesomeIcon icon={faSquareArrowUpRight} className="ml-2" />
        </button>
      </footer>
    </div>
  );
};

export default SubscriptionCard;
