import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { Badge } from "~/components/ui/badge";
import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { env } from "~/env";

interface Props {
  subdomain: string;
  subdomainAvailable: boolean;
}

const HOST =
  env.NEXT_PUBLIC_NODE_ENV === "production" ? `reddex.app/` : `localhost:8000/`;

const SubdomainField = ({ subdomain, subdomainAvailable }: Props) => {
  return (
    <div className="flex w-full flex-col p-4">
      <p className="mb-4 text-xl font-medium text-secondary-foreground">
        Hosted domain
      </p>

      <FormField
        name="subdomain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subdomain</FormLabel>
            <Input placeholder="Your custom subdomain" {...field} />
          </FormItem>
        )}
      />

      <Link href={`https://${subdomain}.${HOST}`} target="_blank">
        <Badge className="mt-2 w-fit" variant="secondary">
          https://
          {subdomain}.{HOST}
        </Badge>
      </Link>
      {subdomain && subdomainAvailable && (
        <span className="mt-2 flex items-center gap-2 text-sm text-green-500">
          <FontAwesomeIcon icon={faCheckCircle} /> Subdomain is available
        </span>
      )}
    </div>
  );
};

export default SubdomainField;
