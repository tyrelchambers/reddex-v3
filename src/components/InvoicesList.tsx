import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Table } from "@mantine/core";
import React from "react";
import Stripe from "stripe";
import { mantineBadgeClasses } from "~/lib/styles";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatStripeTime } from "~/utils/formatStripeTime";

interface Props {
  invoices: Stripe.Invoice[];
}

const InvoicesList = ({ invoices }: Props) => {
  const rows = invoices.map((invoice) => (
    <tr key={invoice.id} className="!border-border">
      <td className="!border-border !text-foreground">
        <Badge color="gray" classNames={mantineBadgeClasses}>
          {invoice.status}
        </Badge>
      </td>
      <td className="!border-border !text-foreground">
        {formatStripeTime(invoice.created)}
      </td>
      <td className="!border-border !text-foreground">
        {formatCurrency(invoice.amount_paid, invoice.currency)}
      </td>
      <td className="!border-border">
        {invoice.invoice_pdf && (
          <a href={invoice.invoice_pdf} download className="text-rose-500">
            Download <FontAwesomeIcon icon={faDownload} className="ml-2" />
          </a>
        )}
      </td>
    </tr>
  ));

  return (
    <div>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th className="!border-border !font-normal !text-foreground/60">
              Status
            </th>
            <th className="!border-border !font-normal !text-foreground/60">
              Invoice date
            </th>
            <th className="!border-border !font-normal !text-foreground/60">
              Total
            </th>
            <th className="!border-border !font-normal !text-foreground/60">
              Receipt PDF
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

export default InvoicesList;
