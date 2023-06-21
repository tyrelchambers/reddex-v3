import {
  faUp,
  faCircleUser,
  faThumbsUp,
  faFolder,
  faCalendar,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RedditPost } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
import ApprovedItemActions from "./ApprovedItemActions";
import CompletedItemActions from "./CompletedItemActions";

interface Props {
  story: RedditPost;
  list: "approved" | "completed";
}

const StoryListItem = ({ story, list }: Props) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-background shadow-md">
      <header className={`flex items-center justify-between gap-3 bg-card p-3`}>
        <div className="flex items-center rounded-full  font-black text-card-foreground/70">
          <FontAwesomeIcon icon={faUp} className="mr-2" />
          {story.ups}
        </div>

        <div className="flex gap-3">
          <div className="flex items-center rounded-full text-sm text-card-foreground/70">
            <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
            {story.author}
          </div>

          <div className="flex items-center rounded-full text-sm text-card-foreground/70">
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {(story.upvote_ratio * 100).toFixed(0)}%
          </div>
        </div>
      </header>
      <Link
        className="  min-h-[100px] p-3 font-bold text-foreground underline hover:text-rose-500"
        href={story.url}
        target="_blank"
      >
        {story.title}
      </Link>

      <footer className="mt-auto flex items-center justify-between bg-card p-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs text-card-foreground/70">
            <FontAwesomeIcon icon={faFolder} />
            <p>{story.subreddit}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-card-foreground/70">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              {formatDistanceToNowStrict(new Date(story.created * 1000))} ago
            </p>
          </div>
        </div>
        {list === "approved" && <ApprovedItemActions postId={story.id} />}
        {list === "completed" && <CompletedItemActions postId={story.id} />}
      </footer>
    </div>
  );
};

export default StoryListItem;
