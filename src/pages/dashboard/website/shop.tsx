import {
  faCheckCircle,
  faRefresh,
  faTimesCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Shop } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { shopSchema } from "~/server/schemas";
import { api } from "~/utils/api";

const ShopIntegration = () => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();

  const [integrationConfig, setIntegrationConfig] = useState<
    z.infer<typeof shopSchema>
  >({
    token: "",
    verifiedConnection: null,
    enabled: false,
    websiteId: "",
    type: "fourthwall",
  });

  const websiteSettings = api.website.settings.useQuery();

  const shopSettings = api.shop.settings.useQuery(websiteSettings.data?.id, {
    enabled: websiteSettings.data?.id !== undefined,
  });

  const verifyIntegration = api.shop.verifyConnection.useMutation({
    onSuccess: (data) => {
      setIntegrationConfig({
        ...integrationConfig,
        verifiedConnection: data,
      });
    },
  });

  const updateStore = api.shop.update.useMutation({
    onSuccess: () => {
      apiContext.shop.invalidate();
    },
  });

  useEffect(() => {
    if (shopSettings.data) {
      setIntegrationConfig({
        ...shopSettings.data,
      });
    }
  }, [shopSettings.data]);

  const update = (data: Partial<Shop>) => {
    if (!websiteSettings.data) return;

    updateStore.mutate({
      ...integrationConfig,
      ...data,
      websiteId: websiteSettings.data.id,
    });
  };

  const verify = () => {
    if (!integrationConfig.token) return;
    verifyIntegration.mutate(integrationConfig.token);
  };

  const save = () => {
    if (!websiteSettings.data) return;

    updateStore.mutate({
      ...integrationConfig,
      websiteId: websiteSettings.data.id,
    });
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading website settings..."
      >
        <h1 className="text-2xl font-bold text-foreground">Shop Integration</h1>
        <p className="mt-2 text-muted-foreground">
          Integrate with Fourthwall to add a storefront to your Reddex website.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          <div className="flex items-center gap-10 rounded-lg border border-border p-4">
            <h2 className="text-xl font-medium">Enable shop</h2>
            <Switch
              checked={integrationConfig.enabled}
              onCheckedChange={(v) =>
                update({
                  enabled: v,
                })
              }
            />
          </div>

          <div className="mt-4 rounded-lg border border-border p-4">
            <h2 className="text-xl font-medium">Fourthwall configuration</h2>
            <p className="text-muted-foreground">
              In order to authenticate with your store, add in your API key
              here. Visit your Fourthwall dashboard to find your API key.{" "}
            </p>
            <p className="text-xs text-muted-foreground">
              Your API key can be found at this URL (replace with your own name)
              &#34;your-storefront-name.fourthwall.com/admin/dashboard/settings/for-developers&#34;
            </p>

            <div className="flex flex-col">
              <div className="mt-4 flex items-center gap-2">
                <Input
                  placeholder="ptkn_***"
                  value={integrationConfig.token ?? ""}
                  onChange={(e) =>
                    setIntegrationConfig({
                      ...integrationConfig,
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
          </div>
          <Button type="button" className="mt-10 w-fit" onClick={save}>
            Save changes
          </Button>
        </div>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default ShopIntegration;
