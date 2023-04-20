import { Divider, NumberInput, Textarea } from "@mantine/core";
import React from "react";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const settings = (props) => {
  const userQuery = api.user.me.useQuery();
  const currentUser = userQuery.data;

  if (!currentUser) return null;

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-3xl">Settings</h1>

        <section className="my-10 flex max-w-lg flex-col gap-10 rounded-xl bg-white p-4">
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Profile
            </h2>

            <div className="flex flex-col">
              <NumberInput
                label="Words per minute"
                description="This will help better calculate the time it takes to read a
                story."
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Recent searches
            </h2>

            {currentUser?.Profile?.searches.map((s, id) => (
              <div key={`${s}_${id}`} className="flex items-baseline">
                <button className="button simple mr-4">Clear</button>
                <p className="font-thin text-gray-600">{s}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Messages
            </h2>

            <Textarea
              label="Greeting"
              description="This message is used when you haven't messaged an author before. Think of it as an initial greeting. Say hello, introduce yourself, go from there."
              defaultValue={currentUser?.Profile?.greeting || undefined}
            />

            <Textarea
              label="Recurring"
              description="This is used when you've already messaged an author. It's useful so users don't feel like they're just getting copy and pasted messages."
              defaultValue={currentUser?.Profile?.recurring || undefined}
            />
          </div>
          <button className="button main mt-3">Save changes</button>
          <Divider className="my-4" />
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Delete account
            </h2>
            <p className="text-sm text-gray-700">
              To delete your account, manage your subscription and cancel your
              membership. Your account will be deleted once your membership is
              cancelled and the billing cycle ends.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default settings;
