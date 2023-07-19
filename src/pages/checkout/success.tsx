import {
  faBadgeCheck,
  faCheck,
  faDownload,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Divider } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { routes } from "~/routes";
import { formatCurrency, formatStripeTime } from "~/utils";
import { api } from "~/utils/api";

const Success = () => {
  const router = useRouter();
  const sessionId = router.query.session_id;
  const sessionQuery = api.stripe.getSession.useQuery(sessionId as string, {
    enabled: !!sessionId,
  });

  const details = sessionQuery.data || null;

  if (!details) {
    return null;
  }

  return (
    <div className="mx-auto my-20 flex w-full max-w-lg flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
        <FontAwesomeIcon icon={faBadgeCheck} className="text-green-700" />
      </div>
      <h1 className="mt-4 text-center text-foreground">Payment successful!</h1>
      <p className="mt-2 text-center font-thin text-foreground/70">
        Your payment has completed successfully and your subscription is now
        active!
      </p>
      <section className="mt-10 flex w-full flex-col gap-3 rounded-2xl bg-card p-4">
        <Row title="Name" body={details.customer_details?.name} />

        <Row
          title="Amount"
          body={formatCurrency(details.amount_total, details.currency)}
        />

        <Row
          title="Payment status"
          body={<Badge color="green">{details.payment_status}</Badge>}
        />

        <Divider />

        <Row title="Customer ID" body={details?.customer as string} />
        <Row title="Invoice #" body={details.invoice?.id} />
        <Row title="Completed on" body={formatStripeTime(details.created)} />

        <footer className="mt-6">
          {details.invoice.invoice_pdf && (
            <a
              href={details.invoice?.invoice_pdf}
              className="flex w-full items-center justify-center rounded-full bg-gray-200 p-4 text-gray-500 hover:bg-gray-300"
              download
            >
              <FontAwesomeIcon icon={faDownload} className="mr-3" />
              <span className="text-sm">Download receipt</span>
            </a>
          )}

          <Link
            href={routes.HOME}
            className="mt-4 flex w-full items-center justify-center rounded-full bg-rose-500 p-4 text-white hover:bg-rose-600"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-3" /> Complete
          </Link>
        </footer>
      </section>
    </div>
  );
};

interface RowProps {
  title: string;
  body: string | undefined | null | React.ReactElement;
}

const Row = ({ title, body }: RowProps) => (
  <div className="flex">
    <p className="text-sm font-thin text-card-foreground">{title}</p>
    {typeof body !== "string" ? (
      <div className="flex flex-1 justify-end">{body}</div>
    ) : (
      <p className="flex-1 text-right text-sm text-card-foreground">
        {body || ""}
      </p>
    )}
  </div>
);

export default Success;
