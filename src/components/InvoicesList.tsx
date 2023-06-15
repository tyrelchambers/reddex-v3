import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Table } from "@mantine/core";
import React from "react";
import Stripe from "stripe";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatStripeTime } from "~/utils/formatStripeTime";

interface Props {
  invoices: Stripe.Invoice[];
}

const InvoicesList = ({ invoices }: Props) => {
  console.log(invoices);
  const rows = invoices.map((invoice) => (
    <tr key={invoice.id}>
      <td className="text-gray-600">
        <Badge color="gray">{invoice.status}</Badge>
      </td>
      <td className="text-gray-600">{formatStripeTime(invoice.created)}</td>
      <td className="text-gray-600">
        {formatCurrency(invoice.amount_paid, invoice.currency)}
      </td>
      <td>
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
            <th className="!font-normal">Status</th>
            <th className="!font-normal">Invoice date</th>
            <th className="!font-normal">Total</th>
            <th className="!font-normal">Receipt PDF</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

export default InvoicesList;
