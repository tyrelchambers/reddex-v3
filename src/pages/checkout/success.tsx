import {
  faBadgeCheck,
  faCheck,
  faDownload,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Divider } from "@mantine/core";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { routes } from "~/routes";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatCurrency";

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
      <h1 className="mt-4 text-center text-gray-800">Payment successful!</h1>
      <p className="mt-2 text-center font-thin text-gray-500">
        Your payment has completed successfully and your subscription is now
        active!
      </p>
      <section className="mt-10 flex w-full flex-col gap-3 rounded-2xl bg-gray-100 p-4">
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
        <Row title="Invoice #" body={details.invoice as string} />
        <Row
          title="Completed on"
          body={format(new Date(details.created * 1000), "MMMM do, yyyy")}
        />

        <footer className="mt-6">
          <a
            href="#"
            className="flex w-full items-center justify-center rounded-full bg-gray-200 p-4 text-gray-500 hover:bg-gray-300"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-3" />
            <span className="text-sm">Download receipt</span>
          </a>

          <Link
            href={routes.HOME}
            className="mt-4 flex w-full items-center justify-center rounded-full bg-indigo-500 p-4 text-white hover:bg-indigo-600"
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
    <p className="text-sm font-thin text-gray-500">{title}</p>
    {body instanceof React.Component ? (
      body
    ) : (
      <p className="flex-1 text-right text-sm text-gray-700">{body || ""}</p>
    )}
  </div>
);

export default Success;
