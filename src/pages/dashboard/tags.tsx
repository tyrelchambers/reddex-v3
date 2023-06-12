import { Modal, NativeSelect, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { FormEvent } from "react";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import TagListItem from "~/components/TagListItem";
import { getStorySelectList } from "~/utils/getStorySelectList";
import EmptyState from "~/components/EmptyState";

const Tags = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const approvedStories = api.post.getApprovedList.useQuery();
  const tagMutation = api.tag.save.useMutation();
  const tagQuery = api.tag.all.useQuery();

  const form = useForm({
    initialValues: {
      tag: "",
      storyId: "",
    },
  });

  const storiesList = getStorySelectList(approvedStories.data);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    tagMutation.mutate(form.values);
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <header className="flex justify-between">
          <h1 className="h1 text-3xl">Tags</h1>
          <button className="button main" onClick={open}>
            Create tag
          </button>
        </header>

        {tagQuery.data && tagQuery.data.length > 0 ? (
          <section className="my-10 grid grid-cols-3 gap-4">
            {tagQuery.data?.map((tag) => (
              <TagListItem key={tag.id} tag={tag} />
            )) || null}
          </section>
        ) : (
          <EmptyState label="tags" />
        )}
      </main>
      <Modal opened={opened} onClose={close} title="Create tag">
        <form onSubmit={submitHandler}>
          <TextInput
            variant="filled"
            label="Name"
            placeholder="A name for your tag"
            {...form.getInputProps("tag")}
          />

          {storiesList && (
            <NativeSelect
              data={storiesList}
              label="Add to an approved story"
              {...form.getInputProps("storyId")}
            />
          )}
          <button
            className="button main mt-4 w-full"
            type="submit"
            onClick={submitHandler}
          >
            Save tag
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Tags;
