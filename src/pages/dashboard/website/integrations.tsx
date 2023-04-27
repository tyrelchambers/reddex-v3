import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import React from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems, routes } from "~/routes";

const integrations = () => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex w-full max-w-2xl flex-col">
          <h1 className="h1 text-2xl">Integrations</h1>
          <p className="text-sm text-gray-500">
            Any integration field that lacks a value will not show up on your
            website.
          </p>
          <form action="" className="mt-10 w-full max-w-md">
            <TextInput
              label="Youtube"
              description="Show the last 5 videos on your website."
              placeholder="Youtube channel ID"
              icon={<FontAwesomeIcon icon={faYoutube} />}
            />

            <button className="button main mt-4 w-full">Save changes</button>
          </form>
        </section>
      </main>
    </>
  );
};

export default integrations;
