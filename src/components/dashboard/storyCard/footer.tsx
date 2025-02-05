import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RedditPost, SubmittedStory } from "@prisma/client";
import clsx from "clsx";
import ApprovedItemActions from "~/components/ApprovedItemActions";
import CompletedItemActions from "~/components/CompletedItemActions";
import SummarizeStory from "~/components/SummarizeStory";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useQueueStore } from "~/stores/queueStore";
import { MixpanelEvents, PostFromReddit } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

interface Props {
  post: PostFromReddit;
  hasBeenUsed: boolean;
}

export const SearchedPostFooter = ({ post, hasBeenUsed }: Props) => {
  const queueStore = useQueueStore();
  const isInQueue = queueStore.exists(post);

  return (
    <div className="flex items-end justify-between gap-2 lg:mt-auto">
      {hasBeenUsed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              className={clsx(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "flex items-center gap-2 rounded-md bg-green-200 p-2 text-xs text-green-800 hover:bg-green-200 hover:text-green-800",
              )}
            >
              <FontAwesomeIcon icon={faCheck} />
              Contacted author
            </TooltipTrigger>
            <TooltipContent>
              You&apos;ve already contacted the author about this story.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="ml-auto flex items-center">
        <SummarizeStory postId={post.id} text={post.selftext} />
        {isInQueue ? (
          <Button
            variant="default"
            className="bg-accent"
            size="sm"
            onClick={() => {
              trackUiEvent(MixpanelEvents.REMOVE_FROM_QUEUE);
              queueStore.remove(post);
            }}
          >
            Remove from queue
          </Button>
        ) : (
          <Button
            title={`Add ${post.title} to queue`}
            size="sm"
            onClick={() => {
              trackUiEvent(MixpanelEvents.ADD_TO_QUEUE);
              queueStore.add(post);
            }}
          >
            Add to queue
          </Button>
        )}
      </div>
    </div>
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
    <footer className="mt-2 flex justify-end lg:flex-row">
      {list === "approved" && (
        <ApprovedItemActions postId={story.id} post={story} />
      )}
      {list === "completed" && <CompletedItemActions postId={story.id} />}
    </footer>
  );
};

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
