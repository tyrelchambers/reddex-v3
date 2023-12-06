import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { GenerateTypes, MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.string(),
});

const StudioId = () => {
  const router = useRouter();

  const storyQuery = api.story.postById.useQuery(router.query.id as string);
  const generateMutation = api.openAi.generate.useMutation({
    onSuccess: (res) => {
      if (res?.result) {
        if (res.type === "title") {
          form.setValue("title", res.result);
        }
        if (res.type === "description") {
          form.setValue("description", res.result);
        }
        if (res.type === "tags") {
          form.setValue("tags", res.result);
        }
      }
    },
    onSettled: (res) => {
      if (res?.type) {
        setLoadingStates({ ...loadingStates, [res.type]: false });
      }
    },
  });
  const [loadingStates, setLoadingStates] = useState({
    title: false,
    description: false,
    tags: false,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });

  const generateHandler = (type: GenerateTypes, postId: string | undefined) => {
    if (!postId) return;

    setLoadingStates({ ...loadingStates, [type]: true });

    generateMutation.mutate({ type, postId });
  };

  const copyToClipboard = (type: GenerateTypes) => {
    const formValues = form.getValues();
    if (type === "title") {
      navigator.clipboard.writeText(formValues.title);
    }
    if (type === "description") {
      navigator.clipboard.writeText(formValues.description);
    }
    if (type === "tags") {
      navigator.clipboard.writeText(formValues.tags);
    }

    toast.info("Copied to clipboard");
  };

  return (
    <WrapperWithNav>
      <header className="w-full ">
        <h1 className="text-3xl text-foreground">Story Studio</h1>
        <p className="text-foreground/70">
          Here you can prep your Youtube video or even podcast episode by using
          OpenAI&apos;s Chat-GPT. Use it to generate a description, a title, or
          even tags.
        </p>
        <p className="mt-6 rounded-lg bg-card p-3 text-sm text-card-foreground">
          Please keep in mind that the results generated here may be hit or
          miss, or require some tweaking. The goal is to give you a headstart
          when uploading your videos.
        </p>
      </header>

      <Separator className="my-10 border-border" />

      <section>
        <p className="mb-2 uppercase text-foreground/70">
          Information will be generated based on this story.
        </p>
        <h2 className=" text-xl text-foreground">{storyQuery.data?.title}</h2>

        <Form {...form}>
          <form className="mt-4  grid w-full grid-cols-2 flex-col gap-6">
            <div className="flex flex-col gap-10 rounded-xl border-[1px] border-border p-6">
              <FormField
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Input placeholder="Title" {...field} />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.COPY_GENERATED_TITLE);
                    copyToClipboard("title");
                  }}
                  disabled={!form.getValues().title}
                >
                  Copy
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.GENERATE_STUDIO_TITLE);
                    generateHandler("title", storyQuery.data?.id);
                  }}
                  disabled={loadingStates.title}
                >
                  {loadingStates.title ? "Generating..." : "Generate title"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-10 rounded-xl border-[1px] border-border p-6">
              <FormField
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <Textarea placeholder="Description" {...field} />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.COPY_GENERATED_DESCRIPTION);
                    copyToClipboard("description");
                  }}
                  disabled={!form.getValues().description}
                >
                  Copy
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.GENERATE_STUDIO_DESCRIPTION);
                    generateHandler("description", storyQuery.data?.id);
                  }}
                  disabled={loadingStates.description}
                >
                  {loadingStates.description
                    ? "Generating..."
                    : "Generate description"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-10 rounded-xl border-[1px] border-border p-6">
              <FormField
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Input {...field} />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.COPY_GENERATED_TAGS);
                    copyToClipboard("tags");
                  }}
                  disabled={!form.getValues().tags}
                >
                  Copy
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.GENERATE_STUDIO_TAGS);
                    generateHandler("tags", storyQuery.data?.id);
                  }}
                  disabled={loadingStates.tags}
                >
                  {loadingStates.tags ? "Generating..." : "Generate tags"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </section>
    </WrapperWithNav>
  );
};

export default StudioId;
