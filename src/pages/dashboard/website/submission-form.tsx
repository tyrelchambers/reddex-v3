import { Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { websiteTabItems } from "~/routes";
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
  submissionFormModules: Module[];
}

const SubmissionForm = () => {
  const apiContext = api.useContext();
  const submissionFormSave = api.website.saveSubmissionForm.useMutation();
  const websiteSettings = api.website.settings.useQuery();
  const saveSubmissionFormVisibility =
    api.website.submissionFormVisibility.useMutation({
      onSuccess: async () => {
        await apiContext.website.getSubmissionFormVisibility.invalidate();
      },
    });
  const submissionFormVisibility =
    api.website.getSubmissionFormVisibility.useQuery(
      websiteSettings.data?.submissionPage?.id,
      {
        enabled: !!websiteSettings.data?.submissionPage?.hidden,
      }
    );

  const form = useForm<SubmissionFormProps>({
    initialValues: {
      name: "",
      subtitle: "",
      description: "",
      submissionFormModules: [],
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({
        ...websiteSettings.data.submissionPage,
        submissionFormModules:
          websiteSettings.data.submissionPage.submissionFormModules,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    const { name, subtitle, description, submissionFormModules } = form.values;

    if (hasErrors) return;

    submissionFormSave.mutate({
      name,
      subtitle,
      description,
      submissionFormModules,
    });
  };

  const visibilityHandler = () => {
    if (!websiteSettings.data?.submissionPage) return;

    saveSubmissionFormVisibility.mutate({
      hidden: !websiteSettings.data?.submissionPage.hidden,
      id: websiteSettings.data?.submissionPage.id,
    });
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} />
        </header>

        <section className="flex w-full max-w-2xl flex-col">
          <div className="mb-10">
            {submissionFormVisibility.data?.hidden ? (
              <DisableBanner clickHandler={visibilityHandler} />
            ) : (
              <EnableBanner clickHandler={visibilityHandler} />
            )}
          </div>
          <h1 className="h1 text-2xl">Submission form</h1>

          <form onSubmit={submitHandler} className="mt-4 flex flex-col gap-4">
            <TextInput label="Page title" {...form.getInputProps("name")} />
            <TextInput
              variant="filled"
              label="Page subtitle"
              {...form.getInputProps("subtitle")}
            />
            <Textarea
              variant="filled"
              label="Description"
              description="List any rules for submissions or any information you want people to know"
              minRows={8}
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
                        {...form.getInputProps(
                          `submissionFormModules.${id}.enabled`,
                          {
                            type: "checkbox",
                          }
                        )}
                      />
                      <Checkbox
                        label="Required"
                        description="Make this field required"
                        {...form.getInputProps(
                          `submissionFormModules.${id}.required`,
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

const EnableBanner = ({ clickHandler }: { clickHandler: () => void }) => (
  <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl bg-indigo-500 p-4 shadow-lg">
    <div className="flex flex-col">
      <p className="text-white">Enable Submission Page</p>
      <p className="text-sm font-thin text-gray-200">
        Enable this submission form to allow visitors to email you their own
        stories.
      </p>
    </div>

    <button
      className="button secondary whitespace-nowrap"
      onClick={clickHandler}
    >
      Enable submission form
    </button>
  </div>
);

const DisableBanner = ({ clickHandler }: { clickHandler: () => void }) => (
  <div className="mt-6 flex w-full items-center justify-between rounded-xl bg-gray-100 p-4">
    <div className="flex flex-col">
      <p className="text-gray-700">Hide Submission Page</p>
      <p className="text-sm font-thin text-gray-500">
        Hide your submission page so others can&apos;t send you stories.
      </p>
    </div>

    <button className="button secondary" onClick={clickHandler}>
      Hide
    </button>
  </div>
);

export default SubmissionForm;
