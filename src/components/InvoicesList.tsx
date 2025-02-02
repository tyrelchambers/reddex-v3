import { faDownload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Stripe from "stripe";
import { formatCurrency, formatStripeTime } from "~/utils";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Props {
  invoices: Stripe.Invoice[];
}

const InvoicesList = ({ invoices }: Props) => {
  const rows = invoices.map((invoice) => (
    <TableRow key={invoice.id} className="border-border!">
      <TableCell className="border-border! text-foreground!">
        <Badge variant="secondary">{invoice.status}</Badge>
      </TableCell>
      <TableCell className="border-border! text-foreground!">
        {formatStripeTime(invoice.created)}
      </TableCell>
      <TableCell className="border-border! text-foreground!">
        {formatCurrency(invoice.amount_paid, invoice.currency)}
      </TableCell>
      <TableCell className="border-border!">
        {invoice.invoice_pdf && (
          <a href={invoice.invoice_pdf} download className="text-rose-500">
            Download <FontAwesomeIcon icon={faDownload} className="ml-2" />
          </a>
        )}
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Invoice date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Receipt PDF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </div>
  );
};

export default InvoicesList;
