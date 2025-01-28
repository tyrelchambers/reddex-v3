import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
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
      rssFeed: "",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.reset({
        youtubeIntegrationId:
          websiteSettings.data?.youtubeIntegrationId ?? undefined,
        rssFeed: websiteSettings.data?.rssFeed ?? undefined,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_INTERGRATIONS_SETTINGS);

    saveIntegrations.mutate(data, {
      onSuccess: () => {
        toast.success("Integrations saved");
      },
      onError: () => {
        toast.error("Error saving integrations");
      },
    });
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

              <FormField
                name="rssFeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSS Feed</FormLabel>
                    <FormDescription>
                      Enables showing your latest podcast episode. Input your
                      podcast&apos;s RSS feed.
                    </FormDescription>
                    <Input placeholder="Your RSS feed" {...field} />
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
