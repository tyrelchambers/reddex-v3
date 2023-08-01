import { Checkbox, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import StatusBanner from "~/components/StatusBanner";
import { Button } from "~/components/ui/button";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineCheckBoxClasses, mantineInputClasses } from "~/lib/styles";
import { websiteTabItems } from "~/routes";
import { useUserStore } from "~/stores/useUserStore";
import { MixpanelEvents } from "~/types";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

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
  const userStore = useUserStore();
  const proPlan = hasProPlan(userStore.user?.subscription);

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

    trackUiEvent(MixpanelEvents.SAVE_SUBMISSION_FORM);
    submissionFormSave.mutate({
      name,
      subtitle,
      description,
      submissionFormModules,
    });
  };

  const visibilityHandler = () => {
    if (!websiteSettings.data?.submissionPage) return;

    trackUiEvent(MixpanelEvents.HIDE_SUBMISSION_FORM);

    saveSubmissionFormVisibility.mutate({
      hidden: !websiteSettings.data?.submissionPage.hidden,
      id: websiteSettings.data?.submissionPage.id,
    });
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className=" my-6 flex max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading submission form settings..."
          hasProPlan={proPlan}
        >
          <h1 className="text-2xl text-foreground">Submission form</h1>

          {submissionFormVisibility.data?.hidden ? (
            <StatusBanner
              title="Enable Submission Page"
              subtitle="Enable this submission form to allow visitors to email you their own stories."
              action={
                <Button
                  variant="defaultInvert"
                  onClick={visibilityHandler}
                  disabled={!proPlan}
                  title={!proPlan ? "Pro plan required" : undefined}
                >
                  Enable submission form
                </Button>
              }
            />
          ) : (
            <StatusBanner
              type="secondary"
              title="Hide Submission Page"
              subtitle="Hide your submission page so others can't send you stories."
              action={
                <Button variant="default" onClick={visibilityHandler}>
                  Hide
                </Button>
              }
            />
          )}

          <form onSubmit={submitHandler} className="form mt-4">
            <TextInput
              variant="filled"
              label="Page title"
              classNames={mantineInputClasses}
              {...form.getInputProps("name")}
            />
            <TextInput
              variant="filled"
              label="Page subtitle"
              classNames={mantineInputClasses}
              {...form.getInputProps("subtitle")}
            />
            <Textarea
              variant="filled"
              label="Description"
              description="List any rules for submissions or any information you want people to know"
              minRows={8}
              classNames={mantineInputClasses}
              {...form.getInputProps("description")}
            />

            <section className="flex flex-col gap-4">
              <p className="text-xl text-foreground">Customize modules</p>

              {websiteSettings.data?.submissionPage.submissionFormModules.map(
                (mod, id) => (
                  <div
                    key={mod.id}
                    className="flex flex-col rounded-xl bg-card p-4"
                  >
                    <p className="label font-bold capitalize text-card-foreground">
                      {mod.name}
                    </p>

                    <div className="mt-2 flex gap-4">
                      <Checkbox
                        label="Enabled"
                        description="Show this module on your submission page"
                        classNames={mantineCheckBoxClasses}
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
                        classNames={mantineCheckBoxClasses}
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

            <Button type="submit" disabled={!proPlan}>
              Save changes
            </Button>
          </form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default SubmissionForm;
