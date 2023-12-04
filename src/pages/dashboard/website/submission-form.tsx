import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@mantine/core";
import React, { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import StatusBanner from "~/components/StatusBanner";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineCheckBoxClasses } from "~/lib/styles";
import { websiteTabItems } from "~/routes";
import { MixpanelEvents } from "~/types";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = z.object({
  name: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  submissionFormModules: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        enabled: z.boolean(),
        required: z.boolean(),
      })
    )
    .optional(),
});

const SubmissionForm = () => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();
  const proPlan = hasProPlan(user?.subscription);

  const submissionFormSave = api.website.saveSubmissionForm.useMutation({
    onSuccess: () => {
      toast.success("Submission form saved");
    },
  });
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      description: "",
      submissionFormModules: [],
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.reset();
      form.setValue(
        "submissionFormModules",
        websiteSettings.data.submissionPage.submissionFormModules
      );
    }
  }, [websiteSettings.data]);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_SUBMISSION_FORM);
    submissionFormSave.mutate(data);
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

          <Form {...form}>
            <form onSubmit={form.onSubmit(submitHandler)} className="form mt-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page title</FormLabel>
                    <Input {...field} />
                  </FormItem>
                )}
              />
              <FormField
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <Label>Page subtitle</Label>
                    <Input {...field} />
                  </FormItem>
                )}
              />

              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      placeholder="List any rules for submissions or any information you want people to know"
                      {...field}
                    />
                  </FormItem>
                )}
              />

              <section className="flex flex-col gap-4">
                <p className="text-xl text-foreground">Customize modules</p>

                {websiteSettings.data?.submissionPage.submissionFormModules.map(
                  (mod, id) => (
                    <FormItem
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
                    </FormItem>
                  )
                )}
              </section>

              <Button type="submit" disabled={!proPlan}>
                Save changes
              </Button>
            </form>
          </Form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default SubmissionForm;
