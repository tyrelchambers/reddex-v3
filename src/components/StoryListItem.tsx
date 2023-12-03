import {
  faUp,
  faCircleUser,
  faThumbsUp,
  faFolder,
  faCalendar,
  faClock,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RedditPost } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
import ApprovedItemActions from "./ApprovedItemActions";
import CompletedItemActions from "./CompletedItemActions";
import { formatReadingTime } from "~/utils";
import { api } from "~/utils/api";

interface Props {
  story: RedditPost;
  list: "approved" | "completed";
}

const StoryListItem = ({ story, list }: Props) => {
  const user = api.user.me.useQuery();
  const readingTime = user.data?.Profile?.words_per_minute;

  console.log(readingTime);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-background shadow-md">
      <header
        className={`flex flex-wrap items-center justify-between gap-3 bg-card p-3`}
      >
        <div className="flex items-center rounded-full  font-black text-card-foreground/70">
          <FontAwesomeIcon icon={faUp} className="mr-2" />
          {story.ups}
        </div>

        <div className="flex flex-wrap gap-3">
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
        className=" block min-h-[100px] p-3 font-bold text-foreground underline hover:text-rose-500"
        href={story.url}
        target="_blank"
      >
        {story.title}
      </Link>

      <div className="flex gap-3 p-2 px-4">
        <div className="flex items-center gap-2 text-xs text-card-foreground/70">
          <FontAwesomeIcon icon={faFolder} />
          <p>{story.subreddit}</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-card-foreground/70">
          <FontAwesomeIcon icon={faCalendar} />
          <p>{formatDistanceToNowStrict(new Date(story.created * 1000))} ago</p>
        </div>

        {readingTime && (
          <div className="flex items-center gap-2 text-xs text-card-foreground/70">
            <FontAwesomeIcon icon={faClock} />
            <p>{formatReadingTime(story.content, readingTime)}min</p>
          </div>
        )}
      </div>
      <footer className="mt-auto flex flex-wrap items-center justify-end gap-4 border-t border-border p-3">
        {list === "approved" && <ApprovedItemActions postId={story.id} />}
        {list === "completed" && <CompletedItemActions postId={story.id} />}
      </footer>
    </div>
  );
};

export default StoryListItem;
