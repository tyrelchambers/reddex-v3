import { Shop } from "@prisma/client";
import React from "react";
import { z } from "zod";
import { Switch } from "~/components/ui/switch";
import { shopSchema } from "~/server/schemas";

interface Props {
  integrationConfig: z.infer<typeof shopSchema>;
  update: (params: Partial<Shop>) => void;
}

const EnableShop = ({ integrationConfig, update }: Props) => {
  return (
    <div className="flex items-center gap-10 rounded-lg border border-border p-4">
      <h2 className="text-xl font-medium text-foreground">Enable shop</h2>
      <Switch
        checked={integrationConfig.enabled}
        onCheckedChange={(v) =>
          update({
            enabled: v,
          })
        }
      />
    </div>
  );
};

export default EnableShop;
