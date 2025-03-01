import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import StatusBanner from "~/components/StatusBanner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import DashboardSection from "~/layouts/DashboardSection";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { websiteSubmissionSchema } from "~/server/schemas";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = websiteSubmissionSchema;

const SubmissionForm = () => {
  const apiContext = api.useUtils();

  const submissionFormSave = api.website.saveSubmissionForm.useMutation({
    onSuccess: () => {
      toast.success("Submission form saved");
    },
  });
  const websiteSettings = api.website.settings.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
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
      },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      description: "",
      submissionFormModules: {
        title: {
          enabled: false,
          required: false,
        },
        author: {
          enabled: false,
          required: false,
        },
        email: {
          enabled: false,
          required: false,
        },
      },
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      const modules =
        websiteSettings.data.submissionPage?.submissionFormModules;

      form.reset({
        ...websiteSettings.data.submissionPage,
        submissionFormModules: {
          author: modules.find(
            (module) => module.name.toLowerCase() === "author",
          ),
          email: modules.find(
            (module) => module.name.toLowerCase() === "email",
          ),
          title: modules.find(
            (module) => module.name.toLowerCase() === "title",
          ),
        },
      });
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
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading submission form settings..."
      >
        <div className="mb-4">
          {" "}
          {submissionFormVisibility.data?.hidden ? (
            <StatusBanner
              title="Enable Submission Page"
              subtitle="Enable this submission form to allow visitors to email you their own stories."
              action={
                <Button variant="defaultInvert" onClick={visibilityHandler}>
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
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="form">
            <DashboardSection title="Submission form">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page title</FormLabel>
                    <Input
                      placeholder="Your submission form page title"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <FormField
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <Label>Page subtitle</Label>
                    <Input placeholder="Subtitle" {...field} />
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
            </DashboardSection>

            <DashboardSection
              title="Customize modules"
              subtitle="Collect writer information using the modules below."
              background
            >
              <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                  <p className="font-bold capitalize text-card-foreground">
                    Title
                  </p>

                  <div className="mt-2 flex flex-col gap-4 md:flex-row">
                    <FormField
                      control={form.control}
                      name={`submissionFormModules.title.enabled`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Enabled</FormLabel>
                            <FormDescription>
                              Show this module on your submission page
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`submissionFormModules.title.required`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                              Make this field required
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col rounded-xl">
                  <p className="font-bold capitalize text-card-foreground">
                    Author
                  </p>

                  <div className="mt-2 flex flex-col gap-4 md:flex-row">
                    <FormField
                      control={form.control}
                      name={`submissionFormModules.author.enabled`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Enabled</FormLabel>
                            <FormDescription>
                              Show this module on your submission page
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`submissionFormModules.author.required`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                              Make this field required
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col rounded-xl">
                  <p className="font-bold capitalize text-card-foreground">
                    Email
                  </p>

                  <div className="mt-2 flex flex-col gap-4 md:flex-row">
                    <FormField
                      control={form.control}
                      name={`submissionFormModules.email.enabled`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Enabled</FormLabel>
                            <FormDescription>
                              Show this module on your submission page
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`submissionFormModules.email.required`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex flex-col">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                              Make this field required
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </DashboardSection>

            <Button type="submit" className="w-fit">
              Save changes
            </Button>
          </form>
        </Form>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default SubmissionForm;
