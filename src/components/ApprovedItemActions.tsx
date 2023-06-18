import { Modal, NativeSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { RedditPost } from "@prisma/client";
import React, { FormEvent } from "react";
import { api } from "~/utils/api";

interface Props {
  postId: RedditPost["id"];
}

const ApprovedItemActions = ({ postId }: Props) => {
  const apiContext = api.useContext();
  const tagMutation = api.tag.add.useMutation();
  const tagQuery = api.tag.all.useQuery();
  const formattedTags =
    tagQuery.data?.map((tag) => ({
      label: tag.tag,
      value: tag.id,
    })) || [];

  const form = useForm({
    initialValues: {
      tagId: "",
    },
  });

  const addToCompleted = api.story.addToCompleted.useMutation({
    onSuccess: () => {
      apiContext.post.getApprovedList.invalidate();
    },
  });
  const [opened, { open, close }] = useDisclosure(false);

  const addTagHandler = (e: FormEvent) => {
    e.preventDefault();

    tagMutation.mutate({
      tagId: form.values.tagId,
      redditPostId: postId,
    });
  };

  return (
    <div className="flex gap-3">
      <button className="button alt" type="button" onClick={open}>
        Add tags
      </button>
      <button
        className="button main"
        onClick={() => addToCompleted.mutate(postId)}
        type="button"
      >
        Mark as read
      </button>

      <Modal opened={opened} onClose={close} title="Add a tag to story">
        <form onSubmit={addTagHandler}>
          <NativeSelect
            data={formattedTags}
            label="Add a tag"
            {...form.getInputProps("tagId")}
          />
          <button className="button main mt-4 w-full" type="submit">
            Add tag to story
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ApprovedItemActions;
