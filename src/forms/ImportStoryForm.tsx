import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
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
import { PostFromReddit } from "~/types";
import { api } from "~/utils/api";

const formSchema = z.object({
  url: z.string().url(),
});

const ImportStoryForm = () => {
  const apiContext = api.useUtils();
  const form = useForm({
    defaultValues: {
      url: "",
    },
  });
  const importStory = api.story.importStory.useMutation({
    onSuccess: () => {
      apiContext.story.getApprovedList.invalidate();
    },
  });

  const submitHandler = async (data: z.infer<typeof formSchema>) => {
    const regex = form.getValues().url.match(/[\s\S]+\//gi);

    if (!regex) return;

    const _url = `${regex[0]}.json`;

    const storyFromUrl = await axios
      .get(_url)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .then((res) => res.data[0].data.children[0].data as PostFromReddit);

    importStory.mutate({
      ...storyFromUrl,
      content: storyFromUrl.selftext,
      story_length: storyFromUrl.selftext.length,
      flair: storyFromUrl.link_flair_text,
      post_id: storyFromUrl.id,
      reading_time: Math.round(storyFromUrl.selftext.length / 200),
      message: storyFromUrl.selftext,
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
