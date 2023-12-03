import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { MixpanelEvents } from "~/types";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Integrations = () => {
  const { data: user } = api.user.me.useQuery();
  const proPlan = hasProPlan(user?.subscription);
  const saveIntegrations = api.website.saveIntegrations.useMutation();
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm({
    initialValues: {
      youtubeIntegrationId: "",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({
        youtubeIntegrationId:
          websiteSettings.data?.youtubeIntegrationId || undefined,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    if (hasErrors) return;

    trackUiEvent(MixpanelEvents.SAVE_INTERGRATIONS_SETTINGS);

    saveIntegrations.mutate(form.values);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className="my-6 flex max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website integrations..."
          hasProPlan={proPlan}
        >
          <h1 className="text-2xl text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Any integration field that lacks a value will not show up on your
            website.
          </p>
          <form onSubmit={submitHandler} className="form mt-10">
            <div className="flex flex-col">
              <Label>Youtube</Label>
              <Input
                placeholder="Youtube channel ID"
                {...form.getInputProps("youtubeIntegrationId")}
              />
            </div>

            <Button type="submit" disabled={!proPlan}>
              Save changes
            </Button>
          </form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default Integrations;
