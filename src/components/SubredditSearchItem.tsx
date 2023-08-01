import {
  faAdd,
  faCalendar,
  faCircleUser,
  faFolder,
  faThumbsUp,
  faUp,
  faHashtag,
  faClock,
  faCheck,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useQueueStore } from "~/stores/queueStore";
import { MixpanelEvents, PostFromReddit } from "~/types";
import { Tooltip, clsx } from "@mantine/core";
import { Button } from "./ui/button";
import { calculateReadingTime } from "~/lib/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";

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
      "bg-foreground/5",
      isInQueue && "!bg-accent",
      hasBeenUsed && "bg-success"
    ),
    headerText: clsx(
      isInQueue && "!text-accent-foreground",
      hasBeenUsed && "text-success-foreground"
    ),
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-background">
      <header
        className={`mb-2 flex items-center justify-between gap-3 ${activeClasses.header} p-3 `}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center rounded-full  font-black text-orange-500 ${activeClasses.headerText}`}
          >
            <FontAwesomeIcon icon={faUp} className="mr-2" />
            {post.ups}
          </div>
          {hasBeenUsed && (
            <Tooltip label="Already used">
              <FontAwesomeIcon
                icon={faCheck}
                className="flex h-3 w-3 items-center gap-2 rounded-full bg-green-200 p-2 text-xs text-green-800"
              />
            </Tooltip>
          )}
        </div>

        <div className="flex gap-3">
          <div
            className={`flex items-center rounded-full text-sm text-card-foreground ${activeClasses.headerText}`}
          >
            <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
            {post.author}
          </div>

          <div
            className={`flex items-center rounded-full text-sm text-card-foreground  ${activeClasses.headerText}`}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {(post.upvote_ratio * 100).toFixed(0)}%
          </div>
        </div>
      </header>
      <Link
        className="p-3 font-bold text-card-foreground underline hover:text-rose-500"
        href={post.url}
        target="_blank"
      >
        {post.title}
      </Link>

      <footer className="mt-auto flex flex-col justify-between p-3 lg:flex-row">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <FontAwesomeIcon icon={faFolder} />
            <p>{post.subreddit}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              {formatDistanceToNowStrict(new Date(post.created * 1000))} ago
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <FontAwesomeIcon icon={faClock} />
            <p>
              {calculateReadingTime(post.selftext, usersWordsPerMinute ?? 200)}{" "}
              mins
            </p>
          </div>

          {post.link_flair_text && (
            <div className="flex items-center gap-2 text-xs text-foreground/50">
              <FontAwesomeIcon icon={faHashtag} />
              <p>{post.link_flair_text}</p>
            </div>
          )}
        </div>

        {canAddToQueue && (
          <div className="mt-4 flex items-end gap-2 lg:mt-0">
            {isInQueue ? (
              <Button
                variant="default"
                size="xs"
                onClick={() => {
                  trackUiEvent(MixpanelEvents.REMOVE_FROM_QUEUE);
                  queueStore.remove(post);
                }}
              >
                Remove from queue
              </Button>
            ) : (
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  trackUiEvent(MixpanelEvents.ADD_TO_QUEUE);
                  queueStore.add(post);
                }}
              >
                <FontAwesomeIcon icon={faAdd} className="mr-2" />
                Add to Queue
              </Button>
            )}
          </div>
        )}
      </footer>
    </div>
  );
};

export default SubredditSearchItem;
