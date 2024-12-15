import { RedditPost } from "@prisma/client";
import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import EmptyState from "./EmptyState";
import { useSession } from "next-auth/react";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";
import { useForm } from "react-hook-form";
import { tagOnPostSchema } from "~/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  postId: RedditPost["id"];
}

const formSchema = tagOnPostSchema.extend({
  redditPostId: z.string().optional(),
});

const ApprovedItemActions = ({ postId }: Props) => {
  const { data } = useSession();

  const apiContext = api.useUtils();
  const tagMutation = api.tag.add.useMutation({
    onSuccess: () => {
      apiContext.tag.all.invalidate();
      close();
    },
  });
  const tagQuery = api.tag.all.useQuery();
  const formattedTags =
    tagQuery.data?.map((tag) => ({
      label: tag.tag,
      value: tag.id,
    })) || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagId: "",
    },
  });

  const addToCompleted = api.story.addToCompleted.useMutation({
    onSuccess: () => {
      apiContext.story.getApprovedList.invalidate();
    },
  });

  const addTagHandler = (data: z.infer<typeof formSchema>) => {
    tagMutation.mutate({
      tagId: data.tagId,
      redditPostId: postId,
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              trackUiEvent(MixpanelEvents.OPEN_TAG_MODAL, {
                userId: data?.user.id,
              });
            }}
          >
            Add tags
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>Add a tag to story</DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addTagHandler)}
              className="flex flex-col gap-4"
            >
              {formattedTags.length > 0 ? (
                <FormField
                  name="tagId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add a tag</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tags" />
                        </SelectTrigger>
                        <SelectContent>
                          {formattedTags.map((tag) => (
                            <SelectItem key={tag.value} value={tag.value}>
                              {tag.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : (
                <EmptyState label="tags" />
              )}
              <Button
                className="w-full"
                type="submit"
                disabled={!formattedTags.length}
                onClick={() =>
                  trackUiEvent(MixpanelEvents.ADD_TAG_TO_STORY, {
                    userId: data?.user.id,
                  })
                }
              >
                Add tag to story
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => {
          trackUiEvent(MixpanelEvents.MARK_AS_READ, {
            userId: data?.user.id,
          });
          addToCompleted.mutate(postId);
        }}
        type="button"
      >
        Mark as read
      </Button>
    </div>
  );
};

export default ApprovedItemActions;
