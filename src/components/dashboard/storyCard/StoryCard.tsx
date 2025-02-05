import { RedditPost, SubmittedStory } from "@prisma/client";
import React from "react";
import { Button } from "../../ui/button";
import { api } from "~/utils/api";
import SummarizeStory from "../../SummarizeStory";
import ApprovedItemActions from "~/components/ApprovedItemActions";
import CompletedItemActions from "~/components/CompletedItemActions";

interface Props {
  children: React.ReactNode;
}

export const SubmittedStoryFooter = ({
  story,
  extraActions,
}: {
  story: SubmittedStory;
  extraActions?: React.ReactNode;
}) => {
  const apiContext = api.useUtils();

  const readSubmittedStory = api.story.readSubmittedStory.useMutation({
    onSuccess: () => {
      apiContext.story.submittedList.invalidate();
    },
  });

  const restoreSubmittedStory = api.story.restoreSubmittedStory.useMutation({
    onSuccess: () => {
      apiContext.story.submittedList.invalidate();
    },
  });

  const markAsRead = (id: string) => {
    readSubmittedStory.mutate(id);
  };

  const restoreStoryHandler = (id: string) => {
    restoreSubmittedStory.mutate(id);
  };

  return (
    <footer className="flex flex-col items-center justify-end lg:flex-row">
      <div className="mt-4 flex items-end gap-2 lg:mt-0">
        <SummarizeStory postId={story.id} text={story.body} />
        {story.read ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => restoreStoryHandler(story.id)}
          >
            Mark as unread
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={() => markAsRead(story.id)}>
            Mark as read
          </Button>
        )}
        {extraActions}
      </div>
    </footer>
  );
};

export const StoryCardPermissionFooter = ({
  list,
  story,
}: {
  story: RedditPost;
  list: "approved" | "completed";
}) => {
  return (
    <footer className="mt-2 flex flex-col items-center justify-end lg:flex-row">
      {list === "approved" && (
        <ApprovedItemActions postId={story.id} post={story} />
      )}
      {list === "completed" && <CompletedItemActions postId={story.id} />}
    </footer>
  );
};

const StoryCard = ({ children }: Props) => {
  return (
    <div className="bg-card flex flex-col gap-3 overflow-hidden rounded-xl p-5 shadow-lg">
      {children}
    </div>
  );
};

export default StoryCard;
