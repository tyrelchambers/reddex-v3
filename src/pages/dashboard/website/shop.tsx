/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Shop } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import Collections from "~/components/dashboard/shop/Collections";
import EnableShop from "~/components/dashboard/shop/EnableShop";
import ShopConfig from "~/components/dashboard/shop/ShopConfig";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { shopSchema } from "~/server/schemas";
import { api } from "~/utils/api";

const ShopIntegration = () => {
  const apiContext = api.useUtils();

  const [integrationConfig, setIntegrationConfig] = useState<
    z.infer<typeof shopSchema>
  >({
    token: "",
    verifiedConnection: null,
    enabled: false,
    websiteId: "",
    type: "fourthwall",
    shopUrl: "",
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
      toast.success("Shop settings saved");
    },
  });

  const shopCollections = api.shop.collections.useQuery(
    shopSettings.data?.token ?? "",
    {
      enabled: shopSettings.data?.token !== undefined,
    },
  );

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

  const updateConfig = (data: Partial<Shop>) => {
    setIntegrationConfig({
      ...integrationConfig,
      ...data,
    });
  };

  const addShopUrl = () => {
    update({
      ...integrationConfig,
      shopUrl: integrationConfig.shopUrl,
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

        <div className="mt-10 flex flex-col gap-8">
          <EnableShop integrationConfig={integrationConfig} update={update} />

          <div className="rounded-xl bg-card p-4">
            <Label>Shop URL</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://shop.example.com"
                onChange={(e) =>
                  setIntegrationConfig({
                    ...integrationConfig,
                    shopUrl: e.target.value,
                  })
                }
                value={integrationConfig.shopUrl ?? ""}
              />
              <Button type="button" onClick={addShopUrl}>
                Save
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <header className="flex flex-col gap-2">
              <h2 className="text-xl font-medium text-foreground">
                Fourthwall configuration
              </h2>
              <p className="text-muted-foreground">
                In order to authenticate with your store, add in your API key
                here. Visit your Fourthwall dashboard to find your API key.{" "}
              </p>
              <p className="text-xs italic text-muted-foreground">
                Your API key can be found at this URL (replace with your own
                name)
                &#34;your-storefront-name.fourthwall.com/admin/dashboard/settings/for-developers&#34;
              </p>
            </header>

            <ShopConfig
              integrationConfig={integrationConfig}
              update={updateConfig}
              verify={verify}
            />
          </div>

          {shopCollections.data && (
            <Collections
              shopId={shopSettings.data?.id ?? ""}
              collections={shopCollections.data}
            />
          )}

          <Button type="button" className="w-fit" onClick={save}>
            Save changes
          </Button>
        </div>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default ShopIntegration;
