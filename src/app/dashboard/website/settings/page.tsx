import React from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes, websiteTabItems } from "~/routes";

const settings = () => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex w-full max-w-2xl flex-col">
          <h1 className="h1 text-2xl">Settings</h1>
          <section className="mt-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-700">Danger zone</h2>
            <p className="font-thin text-gray-600">
              This action is permanent. This will delete your website forever.
            </p>
            <button className="button danger mt-4 ">Delete website</button>
          </section>
        </section>
      </main>
    </>
  );
};

export default settings;
