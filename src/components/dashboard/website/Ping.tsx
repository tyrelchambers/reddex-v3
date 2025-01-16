import { faRotate } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

interface Props {
  domain: string;
}

const Ping = ({ domain }: Props) => {
  const pingRouter = api.ping.ping.useMutation({
    onSuccess: () => {
      toast.success("Connection established");
    },
    onError: () => {
      toast.error("Website unreachable");
    },
  });

  const checkConnection = () => {
    if (!domain) return;

    pingRouter.mutate(domain);
  };
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={checkConnection}
      disabled={pingRouter.isPending}
    >
      <FontAwesomeIcon
        icon={faRotate}
        className="mr-2"
        spin={pingRouter.isPending}
      />
      Check connection
    </Button>
  );
};

export default Ping;
