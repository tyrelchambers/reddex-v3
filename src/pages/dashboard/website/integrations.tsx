import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import DashboardSection from "~/layouts/DashboardSection";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { websiteIntegrationsSchema } from "~/server/schemas";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = websiteIntegrationsSchema;
const Integrations = () => {
  const saveIntegrations = api.website.saveIntegrations.useMutation();
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeIntegrationId: "",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.reset({
        youtubeIntegrationId:
          websiteSettings.data?.youtubeIntegrationId || undefined,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_INTERGRATIONS_SETTINGS);

    saveIntegrations.mutate(data);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading website integrations..."
      >
        <DashboardSection
          title="Integrations"
          subtitle="   Any integration field that lacks a value will not show up on your
            website."
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="form">
              <FormField
                name="youtubeIntegrationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Youtube</FormLabel>
                    <Input placeholder="Youtube channel ID" {...field} />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-fit">
                Save changes
              </Button>
            </form>
          </Form>
        </DashboardSection>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default Integrations;
