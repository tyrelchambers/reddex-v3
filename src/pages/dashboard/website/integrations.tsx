import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import BodyWithLoader from "~/layouts/BodyWithLoader";
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
        <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Any integration field that lacks a value will not show up on your
          website.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="form mt-10"
          >
            <FormField
              name="youtube"
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
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default Integrations;
