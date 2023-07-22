import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import { Button } from "~/components/ui/button";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses } from "~/lib/styles";
import { websiteTabItems } from "~/routes";
import { useUserStore } from "~/stores/useUserStore";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";

const Integrations = () => {
  const userStore = useUserStore();
  const proPlan = hasProPlan(userStore.user?.subscription);
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

    saveIntegrations.mutate(form.values);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className="my-6 flex max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website integrations..."
        >
          <h1 className="text-2xl text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Any integration field that lacks a value will not show up on your
            website.
          </p>
          <form onSubmit={submitHandler} className="form mt-10">
            <TextInput
              variant="filled"
              label="Youtube"
              classNames={mantineInputClasses}
              description="Show the last 5 videos on your website."
              placeholder="Youtube channel ID"
              icon={<FontAwesomeIcon icon={faYoutube} />}
              {...form.getInputProps("youtubeIntegrationId")}
            />

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
