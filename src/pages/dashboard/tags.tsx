import { useDisclosure } from "@mantine/hooks";
import React, { FormEvent } from "react";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import TagListItem from "~/components/TagListItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
import {
  mantineInputClasses,
  mantineModalClasses,
  mantineSelectClasses,
} from "~/lib/styles";
import { getStorySelectList } from "~/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const Tags = () => {
  const apiContext = api.useContext();
  const [opened, { open, close }] = useDisclosure(false);
  const approvedStories = api.story.getApprovedList.useQuery();
  const tagMutation = api.tag.save.useMutation({
    onSuccess: () => {
      apiContext.tag.all.invalidate();
    },
  });
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
    trackUiEvent(MixpanelEvents.CREATE_TAG);
    tagMutation.mutate(form.values);
  };

  return (
    <WrapperWithNav>
      <main className="mx-auto max-w-screen-2xl px-4 lg:px-0">
        <header className="flex justify-between">
          <h1 className="text-2xl text-foreground">Tags</h1>
          <Button
            variant="secondary"
            onClick={() => {
              trackUiEvent(MixpanelEvents.OPEN_TAG_MODAL);
              open();
            }}
          >
            Create tag
          </Button>
        </header>

        {tagQuery.data && tagQuery.data.length > 0 ? (
          <section className="my-10 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {tagQuery.data?.map((tag) => (
              <TagListItem key={tag.id} tag={tag} />
            )) || null}
          </section>
        ) : (
          <EmptyState label="tags" />
        )}
      </main>
      <Dialog open={opened}>
        <DialogContent onClose={close}>
          <DialogHeader>Create a tag</DialogHeader>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label>Name</Label>
              <Input
                placeholder="A name for your tag"
                {...form.getInputProps("tag")}
              />
            </div>

            <div className="flex flex-col">
              <Label>Story list</Label>
              {storiesList && (
                <Select>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {storiesList.map((story) => (
                      <SelectItem key={story.value} value={story.value}>
                        {story.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Button
              className="mt-6 w-full"
              type="submit"
              onClick={submitHandler}
            >
              Save tag
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </WrapperWithNav>
  );
};

export default Tags;
