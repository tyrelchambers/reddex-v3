import {
  faFacebook,
  faInstagram,
  faPatreon,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPodcast } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes, websiteTabItems } from "~/routes";

const General = () => {
  const form = useForm({
    initialValues: {},
  });

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
              <p className="text-white">Activate Website</p>
              <p className="text-sm font-thin text-gray-200">
                Enable your website to be seen by the public.
              </p>
            </div>

            <button className="button secondary">Make website public</button>
          </div>

          <form className="my-10">
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
                />
                <span className="px-3 text-gray-500">.reddex.app</span>
              </div>
            </div>

            <TextInput label="Site name" placeholder="Name of your site" />
            <Textarea
              label="Site description"
              description="Let people know who you are"
            />

            <Divider className="my-10" />

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
                />
                <TextInput
                  placeholder="Facebook"
                  icon={<FontAwesomeIcon icon={faFacebook} />}
                />
                <TextInput
                  placeholder="Instagram"
                  icon={<FontAwesomeIcon icon={faInstagram} />}
                />
                <TextInput
                  placeholder="Patreon"
                  icon={<FontAwesomeIcon icon={faPatreon} />}
                />
                <TextInput
                  placeholder="Youtube"
                  icon={<FontAwesomeIcon icon={faYoutube} />}
                />
                <TextInput
                  placeholder="Podcast"
                  icon={<FontAwesomeIcon icon={faPodcast} />}
                />
              </div>
            </section>

            <section className="mt-10 flex flex-col">
              <h2 className="text-xl font-bold text-gray-700">Danger zone</h2>
              <p className="font-thin text-gray-600">
                This action is permanent. This will delete your website forever.
              </p>
              <button className="button main mt-4 !bg-red-500">
                Delete website
              </button>
            </section>
          </form>
        </section>
      </main>
    </>
  );
};

export default General;
