import {
  faAdd,
  faCircleUser,
  faThumbsUp,
  faCheck,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useQueueStore } from "~/stores/queueStore";
import { MixpanelEvents, PostFromReddit } from "~/types";
import { Button, buttonVariants } from "./ui/button";
import { calculateReadingTime } from "~/lib/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import SummarizeStory from "./SummarizeStory";
import {
  faCalendar,
  faClock,
  faFolder,
  faHashtag,
  faUp,
} from "@fortawesome/pro-regular-svg-icons";
import { Badge } from "./ui/badge";

interface Props {
  post: PostFromReddit;
  hasBeenUsed: boolean;
  usersWordsPerMinute: number | null | undefined;
  canAddToQueue: boolean;
}

const SubredditSearchItem = ({
  post,
  hasBeenUsed,
  usersWordsPerMinute,
  canAddToQueue,
}: Props) => {
  const queueStore = useQueueStore();

  const isInQueue = queueStore.exists(post);

  const activeClasses = {
    header: clsx(
      isInQueue && "border-2 border-accent",
      hasBeenUsed && "bg-success",
    ),
    headerText: clsx(hasBeenUsed && "text-success-foreground"),
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-5 shadow-lg",
        activeClasses.header,
      )}
    >
      <header className={`mb-2 flex gap-6`}>
        <div
          className={`flex flex-col items-center rounded-full font-black text-foreground ${activeClasses.headerText}`}
        >
          <FontAwesomeIcon icon={faUp} />
          <span className="text-xl">{post.ups}</span>
        </div>

        <div className="-mt-2 flex flex-col gap-2">
          {" "}
          <Link
            className="text-xl font-bold text-foreground underline hover:text-rose-500"
            href={post.url}
            target="_blank"
          >
            {post.title}
          </Link>
          <div className="flex gap-3">
            <div
              className={`flex items-center rounded-full text-sm text-foreground ${activeClasses.headerText}`}
            >
              <span className="font-foreground/70 text-xs">by</span>{" "}
              <span className="ml-1 font-semibold">{post.author}</span>
            </div>

            <Badge>{(post.upvote_ratio * 100).toFixed(0)}% Rating</Badge>
          </div>
        </div>
      </header>

      <div className="mt-auto flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <FontAwesomeIcon icon={faClock} />
          <p>
            {calculateReadingTime(post.selftext, usersWordsPerMinute ?? 200)}{" "}
            mins
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <FontAwesomeIcon icon={faCalendar} />
          <p>{formatDistanceToNowStrict(new Date(post.created * 1000))} ago</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <FontAwesomeIcon icon={faFolder} />
          <p>{post.subreddit}</p>
        </div>

        {post.link_flair_text && (
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <FontAwesomeIcon icon={faHashtag} />
            <p>{post.link_flair_text}</p>
          </div>
        )}
      </div>
      <footer className="flex flex-col items-center justify-between lg:flex-row">
        <div className="flex items-center">
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
                  Seen
                </TooltipTrigger>
                <TooltipContent>
                  You&apos;ve already contacted the author about this story.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {canAddToQueue && (
          <div className="mt-4 flex items-end gap-2 lg:mt-0">
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
        )}
      </footer>
    </div>
  );
};

export default SubredditSearchItem;
