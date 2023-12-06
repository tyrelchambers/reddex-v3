import { useDisclosure } from "@mantine/hooks";
import React= from "react";
import { api } from "~/utils/api";
import TagListItem from "~/components/TagListItem";
import EmptyState from "~/components/EmptyState";
import { Button } from "~/components/ui/button";
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
import { useForm } from "react-hook-form";
import { tagSaveSchema } from "~/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";

const formSchema = tagSaveSchema;

const Tags = () => {
  const apiContext = api.useUtils();
  const [opened, { open, close }] = useDisclosure(false);
  const approvedStories = api.story.getApprovedList.useQuery();
  const tagMutation = api.tag.save.useMutation({
    onSuccess: () => {
      apiContext.tag.all.invalidate();
    },
  });
  const tagQuery = api.tag.all.useQuery();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
      storyId: "",
    },
  });

  const storiesList = getStorySelectList(approvedStories.data);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.CREATE_TAG);
    tagMutation.mutate(data);
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="flex flex-col gap-4"
            >
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="A name for your tag" {...field} />
                  </FormItem>
                )}
              />

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
              <Button className="mt-6 w-full" type="submit">
                Save tag
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </WrapperWithNav>
  );
};

export default Tags;
