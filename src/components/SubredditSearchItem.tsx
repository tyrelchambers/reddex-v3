import {
  faAdd,
  faCalendar,
  faCircleUser,
  faFolder,
  faThumbsUp,
  faUp,
  faWarning,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useQueueStore } from "~/stores/queueStore";
import { PostFromReddit } from "~/types";
import { Tooltip, clsx } from "@mantine/core";
import { Button } from "./ui/button";

interface Props {
  post: PostFromReddit;
  hasBeenUsed: boolean;
}

const SubredditSearchItem = ({ post, hasBeenUsed }: Props) => {
  const queueStore = useQueueStore();

  const isInQueue = queueStore.exists(post);

  const activeClasses = {
    header: clsx(isInQueue ? "bg-accent/80" : "bg-foreground/10"),
    headerText: clsx(isInQueue && "text-white"),
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-card">
      <header
        className={`mb-2 flex items-center justify-between gap-3 ${activeClasses.header} p-3 py-5`}
      >
        <div
          className={`flex items-center rounded-full  font-black text-orange-500 ${activeClasses.headerText}`}
        >
          <FontAwesomeIcon icon={faUp} className="mr-2" />
          {post.ups}
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

      <footer className="mt-auto flex items-end justify-between p-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
            <FontAwesomeIcon icon={faFolder} />
            <p>{post.subreddit}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-primary-foreground/50">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              {formatDistanceToNowStrict(new Date(post.created * 1000))} ago
            </p>
          </div>
        </div>

        <div className="flex items-end gap-2">
          {hasBeenUsed && (
            <Tooltip label="Already used">
              <FontAwesomeIcon
                icon={faWarning}
                className="flex items-center gap-2 rounded-full bg-yellow-100 p-2 text-xs text-yellow-800"
              />
            </Tooltip>
          )}
          {isInQueue ? (
            <Button
              variant="default"
              size="xs"
              onClick={() => queueStore.remove(post)}
            >
              Remove from queue
            </Button>
          ) : (
            <Button
              variant="outline"
              size="xs"
              onClick={() => queueStore.add(post)}
            >
              <FontAwesomeIcon icon={faAdd} className="mr-2" />
              Add to Queue
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default SubredditSearchItem;
