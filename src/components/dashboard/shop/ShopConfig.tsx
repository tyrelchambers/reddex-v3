import {
  faCheckCircle,
  faRefresh,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Shop } from "@prisma/client";
import React from "react";
import { Z } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { shopSchema } from "~/server/schemas";

interface Props {
  integrationConfig: z.infer<typeof shopSchema>;
  update: (params: Partial<Shop>) => void;
  verify: () => void;
}

const ShopConfig = ({ integrationConfig, update, verify }: Props) => {
  return (
    <div className="flex flex-col">
      <div className="mt-4 flex items-center gap-2">
        <Input
          placeholder="ptkn_***"
          value={integrationConfig.token ?? ""}
          onChange={(e) =>
            update({
              token: e.target.value,
            })
          }
        />
        <Button
          type="button"
          disabled={!integrationConfig.token}
          onClick={verify}
        >
          <FontAwesomeIcon icon={faRefresh} className="mr-2" />
          Verify connection
        </Button>
      </div>
      {integrationConfig.verifiedConnection !== null && (
        <>
          {integrationConfig.verifiedConnection ? (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-green-50 p-2 px-4 text-green-500">
              <FontAwesomeIcon icon={faCheckCircle} />
              <span className="text-sm text-green-800">
                Connection verified!
              </span>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 bg-red-50 p-2 px-4 text-red-500">
              <FontAwesomeIcon icon={faTimesCircle} />
              <span className="text-sm text-red-800">
                Connection not verified
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopConfig;
