import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const formSchema = z.object({
  url: z.string().url(),
});

const ImportStoryForm = () => {
  const apiContext = api.useUtils();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });
  const importStory = api.story.importStory.useMutation({
    onSuccess: () => {
      apiContext.story.getApprovedList.invalidate();
    },
  });

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    importStory.mutate(data.url, {
      onSuccess: () => {
        form.reset();
        toast.success("Story imported successfully!");
        trackUiEvent(MixpanelEvents.IMPORT_STORY);
      },
    });
  };

  return (
    <Form {...form}>
      <form className="mt-4" onSubmit={form.handleSubmit(submitHandler)}>
        <FormField
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story URL</FormLabel>
              <FormDescription>
                This imports a story without asking for permission. In case you
                are given permission outside Reddex, for example.
              </FormDescription>
              <Input placeholder="https://www.reddit.com/r/" {...field} />
            </FormItem>
          )}
        />

        <Button className="mt-4 w-full" type="submit">
          Import
        </Button>
      </form>
    </Form>
  );
};

export default ImportStoryForm;
