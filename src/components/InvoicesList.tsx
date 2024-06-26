import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "@mantine/core";
import React from "react";
import Stripe from "stripe";
import { formatCurrency, formatStripeTime } from "~/utils";
import { Badge } from "./ui/badge";

interface Props {
  invoices: Stripe.Invoice[];
}

const InvoicesList = ({ invoices }: Props) => {
  const rows = invoices.map((invoice) => (
    <tr key={invoice.id} className="!border-border">
      <td className="!border-border !text-foreground">
        <Badge variant="secondary">{invoice.status}</Badge>
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
    <div className="mt-4">
      <Table highlightOnHover className="w-full">
        <thead className="w-full">
          <tr className="w-full">
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
