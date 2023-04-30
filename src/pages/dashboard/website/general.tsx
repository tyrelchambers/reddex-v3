import {
  faFacebook,
  faInstagram,
  faPatreon,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, TextInput, Textarea } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes, websiteTabItems } from "~/routes";
import { GeneralSettings } from "~/types";
import { api } from "~/utils/api";

const General = () => {
  const apiContext = api.useContext();
  const websiteSave = api.website.saveGeneral.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
    },
  });
  const websiteSettings = api.website.getSettings.useQuery();
  const form = useForm<GeneralSettings>({
    initialValues: {
      subdomain: "",
      name: "",
      description: "",
      twitter: "",
      facebook: "",
      instagram: "",
      patreon: "",
      podcast: "",
      youtube: "",
    },

    clearInputErrorOnChange: true,
    validate: {
      subdomain: isNotEmpty(),
      name: isNotEmpty(),
    },
  });
  const subdomainQuery = api.website.checkAvailableSubdomain.useQuery(
    form.values.subdomain as string,
    {
      enabled: !!form.values.subdomain,
    }
  );

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({ ...websiteSettings.data });
    }
  }, [websiteSettings.data]);

  const subdomainAvailable = !subdomainQuery.data;

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    if (hasErrors) return;

    websiteSave.mutate(form.values);
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex w-full max-w-2xl flex-col">
          <h1 className="h1 text-2xl">General</h1>

          <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-indigo-500 p-4 shadow-lg">
            <div className="flex flex-col">
              <p className="text-white">Enable Website</p>
              <p className="text-sm font-thin text-gray-200">
                Enable your website to be seen by the public.
              </p>
            </div>

            <button className="button secondary">Make website public</button>
          </div>

          <form className="my-10 flex flex-col gap-4" onSubmit={submitHandler}>
            <div className="flex w-full flex-col">
              <p className="label">Subdomain</p>
              <div className="flex h-fit items-center rounded-lg bg-gray-100 p-1">
                <span className="px-3 text-gray-500">http://</span>
                <TextInput
                  placeholder="subdomain"
                  className="flex-1 rounded-none"
                  classNames={{
                    input: "bg-gray-100 border-0",
                  }}
                  {...form.getInputProps("subdomain")}
                />
                <span className="px-3 text-gray-500">.reddex.app</span>
              </div>
              {subdomainAvailable && (
                <span className="mt-2 flex items-center gap-2 text-sm text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} /> Subdomain is
                  available
                </span>
              )}
            </div>

            <TextInput
              label="Site name"
              placeholder="Name of your site"
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Site description"
              description="Let people know who you are"
              {...form.getInputProps("description")}
            />

            <Divider className="my-4" />

            <section className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-700">Social media</h2>
              <p className="font-thin text-gray-600">
                The links below will appear as social icons on your site. These
                are not required, and the icons will not appear on your site if
                you leave them blank.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <TextInput
                  placeholder="Twitter"
                  icon={<FontAwesomeIcon icon={faTwitter} />}
                  {...form.getInputProps("twitter")}
                />
                <TextInput
                  placeholder="Facebook"
                  icon={<FontAwesomeIcon icon={faFacebook} />}
                  {...form.getInputProps("facebook")}
                />
                <TextInput
                  placeholder="Instagram"
                  icon={<FontAwesomeIcon icon={faInstagram} />}
                  {...form.getInputProps("instagram")}
                />
                <TextInput
                  placeholder="Patreon"
                  icon={<FontAwesomeIcon icon={faPatreon} />}
                  {...form.getInputProps("patreon")}
                />
                <TextInput
                  placeholder="Youtube"
                  icon={<FontAwesomeIcon icon={faYoutube} />}
                  {...form.getInputProps("youtube")}
                />
                <TextInput
                  placeholder="Podcast"
                  icon={<FontAwesomeIcon icon={faPodcast} />}
                  {...form.getInputProps("podcast")}
                />
              </div>
            </section>
            <Divider className="my-4" />

            <button type="submit" className="button main">
              Save changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default General;
