import { Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems, routes } from "~/routes";
import { api } from "~/utils/api";

interface Module {
  id?: string;
  name: string;
  enabled: boolean;
  required: boolean;
}

interface SubmissionFormProps {
  name: string | null;
  subtitle: string | null;
  description: string | null;
}

const SubmissionForm = () => {
  const submissionFormSave = api.website.saveSubmissionForm.useMutation();
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm<SubmissionFormProps>({
    initialValues: {
      name: "",
      subtitle: "",
      description: "",
    },
  });

  const formModules = useForm<{ modules: Module[] }>({
    initialValues: {
      modules: [],
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({ ...websiteSettings.data });
      formModules.setValues({
        modules: websiteSettings.data.submissionPage.submissionFormModules,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    const { name, subtitle, description } = form.values;

    if (hasErrors) return;

    submissionFormSave.mutate({
      name,
      subtitle,
      description,
      submissionFormModules: formModules.values.modules,
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

              {websiteSettings.data?.submissionPage.submissionFormModules.map(
                (mod, id) => (
                  <div
                    key={mod.id}
                    className="flex flex-col rounded-xl bg-gray-50 p-4"
                  >
                    <p className="label font-bold capitalize text-gray-700">
                      {mod.name}
                    </p>

                    <div className="mt-2 flex gap-4">
                      <Checkbox
                        label="Enabled"
                        description="Show this module on your submission page"
                        {...formModules.getInputProps(`modules.${id}.enabled`, {
                          type: "checkbox",
                        })}
                      />
                      <Checkbox
                        label="Required"
                        description="Make this field required"
                        {...formModules.getInputProps(
                          `modules.${id}.required`,
                          {
                            type: "checkbox",
                          }
                        )}
                      />
                    </div>
                  </div>
                )
              )}
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
