import { Checkbox, TextInput, Textarea } from "@mantine/core";
import React from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems, routes } from "~/routes";

const SubmissionForm = () => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex w-full max-w-2xl flex-col">
          <h1 className="h1 text-2xl">Submission form</h1>

          <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl bg-indigo-500 p-4 shadow-lg">
            <div className="flex flex-col">
              <p className="text-white">Enable Submission Form</p>
              <p className="text-sm font-thin text-gray-200">
                Enable this submission form to allow visitors to email you their
                own stories.
              </p>
            </div>

            <button className="button secondary whitespace-nowrap">
              Enable submission form
            </button>
          </div>

          <form action="" className="mt-10 flex flex-col gap-4">
            <TextInput label="Page title" />
            <TextInput label="Page subtitle" />
            <Textarea
              label="Description"
              description="List any rules for submissions or any information you want people to know"
            />

            <section className="mt-10 flex flex-col gap-4">
              <p className="text-grayy-800 text-xl font-semibold">
                Customize modules
              </p>

              <div className="flex flex-col rounded-xl bg-gray-50 p-4">
                <p className="label font-bold text-gray-700">Author</p>

                <div className="mt-2 flex gap-4">
                  <Checkbox
                    label="Enabled"
                    description="Show this module on your submission page"
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-xl bg-gray-50 p-4">
                <p className="label font-bold text-gray-700">Title</p>

                <div className="mt-2 flex gap-4">
                  <Checkbox
                    label="Enabled"
                    description="Show this module on your submission page"
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-xl bg-gray-50 p-4">
                <p className="label font-bold text-gray-700">Email</p>

                <div className="mt-2 flex gap-4">
                  <Checkbox
                    label="Enabled"
                    description="Show this module on your submission page"
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                  />
                </div>
              </div>
            </section>

            <button className="button main mt-4 w-full">Save changes</button>
          </form>
        </section>
      </main>
    </>
  );
};

export default SubmissionForm;
