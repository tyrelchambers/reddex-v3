import { Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems, routes } from "~/routes";
import { SubmissionFormModuleWithoutId } from "~/types";
import { api } from "~/utils/api";

const SubmissionForm = () => {
  const submissionFormSave = api.website.saveSubmissionForm.useMutation();
  const form = useForm({
    initialValues: {
      name: "",
      subtitle: "",
      description: "",
      author_enabled: false,
      author_required: false,
      title_enabled: false,
      title_required: false,
      email_enabled: false,
      email_required: false,
    },
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();
    const authorModule: SubmissionFormModuleWithoutId = {
      name: "author",
      enabled: form.values.author_enabled,
      required: form.values.author_required,
    };
    const titleModule: SubmissionFormModuleWithoutId = {
      name: "title",
      enabled: form.values.title_enabled,
      required: form.values.title_required,
    };
    const emailModule: SubmissionFormModuleWithoutId = {
      name: "email",
      enabled: form.values.email_enabled,
      required: form.values.email_required,
    };
    const submissionFormModules: SubmissionFormModuleWithoutId[] = [
      authorModule,
      titleModule,
      emailModule,
    ];
    const { name, subtitle, description } = form.values;

    if (hasErrors) return;

    submissionFormSave.mutate({
      name,
      subtitle,
      description,
      submissionFormModules,
    });
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

          <form onSubmit={submitHandler} className="mt-10 flex flex-col gap-4">
            <TextInput label="Page title" {...form.getInputProps("name")} />
            <TextInput
              label="Page subtitle"
              {...form.getInputProps("subtitle")}
            />
            <Textarea
              label="Description"
              description="List any rules for submissions or any information you want people to know"
              {...form.getInputProps("description")}
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
                    {...form.getInputProps("author_enabled")}
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                    {...form.getInputProps("author_required")}
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-xl bg-gray-50 p-4">
                <p className="label font-bold text-gray-700">Title</p>

                <div className="mt-2 flex gap-4">
                  <Checkbox
                    label="Enabled"
                    description="Show this module on your submission page"
                    {...form.getInputProps("title_enabled")}
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                    {...form.getInputProps("title_required")}
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-xl bg-gray-50 p-4">
                <p className="label font-bold text-gray-700">Email</p>

                <div className="mt-2 flex gap-4">
                  <Checkbox
                    label="Enabled"
                    description="Show this module on your submission page"
                    {...form.getInputProps("email_enabled")}
                  />
                  <Checkbox
                    label="Required"
                    description="Make this field required"
                    {...form.getInputProps("email_required")}
                  />
                </div>
              </div>
            </section>

            <button type="submit" className="button main mt-4 w-full">
              Save changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default SubmissionForm;
