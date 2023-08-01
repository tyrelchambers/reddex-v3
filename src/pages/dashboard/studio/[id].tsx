import { Divider, MultiSelect, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses, mantineSelectClasses } from "~/lib/styles";
import { GenerateTypes, MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

interface FormProps {
  title: string;
  description: string;
  tags: string[];
}

const StudioId = () => {
  const router = useRouter();

  const storyQuery = api.story.postById.useQuery(router.query.id as string);
  const generateMutation = api.openAi.generate.useMutation({
    onSuccess: (res) => {
      if (res) {
        if (res.type === "title" && res.result) {
          form.setFieldValue("title", res.result);
        }
        if (res.type === "description" && res.result) {
          form.setFieldValue("description", res.result);
        }
        if (res.type === "tags" && res.result) {
          form.setFieldValue("tags", res.result.split(","));
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

  const form = useForm<FormProps>({
    initialValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  const generateHandler = (type: GenerateTypes, postId: string | undefined) => {
    if (!postId) return;

    setLoadingStates({ ...loadingStates, [type]: true });

    generateMutation.mutate({ type, postId });
  };

  const copyToClipboard = (type: GenerateTypes) => {
    if (type === "title") {
      navigator.clipboard.writeText(form.values.title);
    }
    if (type === "description") {
      navigator.clipboard.writeText(form.values.description);
    }
    if (type === "tags") {
      navigator.clipboard.writeText(form.values.tags.join(","));
    }

    toast.info("Copied to clipboard");
  };

  return (
    <WrapperWithNav>
      <header className="w-full max-w-2xl">
        <h1 className="text-2xl text-foreground">Story Studio</h1>
        <p className="font-light text-foreground/70">
          Here you can prep your Youtube video or even podcast episode by using
          OpenAI&apos;s Chat-GPT. Use it to generate a description, a title, or
          even tags.
        </p>
      </header>

      <Divider className="my-10 border-border" />

      <section>
        <p className="mb-2 uppercase text-foreground/70">
          Information will be generated based on this story.
        </p>
        <h2 className=" text-xl text-foreground">{storyQuery.data?.title}</h2>

        <form className="mt-4 flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-10 rounded-xl border-[1px] border-border p-6">
            <TextInput
              classNames={mantineInputClasses}
              name="title"
              label="Title"
              placeholder="Title"
              {...form.getInputProps("title")}
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
                disabled={!form.values.title}
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
            <Textarea
              classNames={mantineInputClasses}
              name="description"
              label="Description"
              placeholder="Description"
              minRows={4}
              {...form.getInputProps("description")}
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
                disabled={!form.values.description}
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
            <MultiSelect
              data={form.values.tags}
              name="tags"
              label="Tags"
              placeholder="Tags"
              classNames={mantineSelectClasses}
              {...form.getInputProps("tags")}
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
                disabled={!form.values.tags}
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
      </section>
    </WrapperWithNav>
  );
};

export default StudioId;
