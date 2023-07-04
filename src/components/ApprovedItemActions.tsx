import { Modal, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { RedditPost } from "@prisma/client";
import React, { FormEvent } from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { mantineModalClasses, mantineSelectClasses } from "~/lib/styles";
import EmptyState from "./EmptyState";
import Link from "next/link";
import { routes } from "~/routes";

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
      apiContext.story.getApprovedList.invalidate();
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
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" type="button" onClick={open}>
        Add tags
      </Button>
      <Button
        variant="outline"
        onClick={() => addToCompleted.mutate(postId)}
        type="button"
      >
        Mark as read
      </Button>
      <Link href={routes.STUDIO + `/${postId}`}>
        <Button>View in Studio</Button>
      </Link>

      <Modal
        opened={opened}
        onClose={close}
        classNames={mantineModalClasses}
        title="Add a tag to story"
      >
        <form onSubmit={addTagHandler} className="flex flex-col gap-4">
          {formattedTags.length > 0 ? (
            <Select
              data={formattedTags}
              label="Add a tag"
              withinPortal
              classNames={mantineSelectClasses}
              {...form.getInputProps("tagId")}
            />
          ) : (
            <EmptyState label="tags" />
          )}
          <Button
            className="w-full"
            type="submit"
            disabled={!formattedTags.length}
          >
            Add tag to story
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ApprovedItemActions;
