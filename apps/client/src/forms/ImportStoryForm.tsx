import { TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import React, { FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { mantineInputClasses } from "~/lib/styles";
import { PostFromReddit } from "~/types";
import { api } from "~/utils/api";

const ImportStoryForm = () => {
  const apiContext = api.useContext();
  const form = useForm({
    initialValues: {
      url: "",
    },
  });
  const importStory = api.story.importStory.useMutation({
    onSuccess: () => {
      apiContext.story.getApprovedList.invalidate();
    },
  });

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const { hasErrors } = form.validate();

    if (hasErrors) {
      return;
    }
    const regex = form.values.url.match(/[\s\S]+\//gi);

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
    <form>
      <TextInput
        classNames={mantineInputClasses}
        label="Story URL"
        description="This imports a story without asking for permission. In case you are given permission outside Reddex, for example."
        placeholder="https://www.reddit.com/r/"
        name="storyUrl"
        {...form.getInputProps("url")}
      />

      <Button className="mt-4 w-full" onClick={submitHandler}>
        Import
      </Button>
    </form>
  );
};

export default ImportStoryForm;
