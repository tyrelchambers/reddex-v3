import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import TabsList from "~/components/TabsList";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems } from "~/routes";
import { api } from "~/utils/api";

const Integrations = () => {
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
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} />
        </header>

        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website integrations..."
        >
          <h1 className="h1 text-2xl">Integrations</h1>
          <p className="text-sm text-gray-500">
            Any integration field that lacks a value will not show up on your
            website.
          </p>
          <form onSubmit={submitHandler} className="mt-10 w-full max-w-md">
            <TextInput
              variant="filled"
              label="Youtube"
              description="Show the last 5 videos on your website."
              placeholder="Youtube channel ID"
              icon={<FontAwesomeIcon icon={faYoutube} />}
              {...form.getInputProps("youtubeIntegrationId")}
            />

            <button className="button main mt-4 w-full" type="submit">
              Save changes
            </button>
          </form>
        </BodyWithLoader>
      </main>
    </>
  );
};

export default Integrations;
