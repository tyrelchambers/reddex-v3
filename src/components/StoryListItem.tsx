import {
  faUp,
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
import { api } from "~/utils/api";
import { calculateReadingTime } from "~/lib/utils";
import { faHashtag } from "@fortawesome/pro-light-svg-icons";
import { Badge } from "./ui/badge";

interface Props {
  story: RedditPost;
  list: "approved" | "completed";
}

const StoryListItem = ({ story, list }: Props) => {
  const user = api.user.me.useQuery();
  const readingTime = user.data?.Profile?.words_per_minute;

  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-5 shadow-lg">
      <header className={`mb-2 flex gap-6`}>
        <div className="flex flex-col items-center rounded-full font-black text-foreground">
          <FontAwesomeIcon icon={faUp} />
          <span className="text-xl">{story.ups}</span>
        </div>

        <div className="-mt-2 flex flex-col gap-2">
          <Link
            className="text-xl font-bold text-foreground underline hover:text-rose-500"
            href={story.url}
            target="_blank"
          >
            {story.title}
          </Link>
          <div className="flex gap-3">
            <div className="flex items-center rounded-full text-sm text-foreground">
              <span className="font-foreground/70 text-xs">by</span>{" "}
              <span className="ml-1 font-semibold">{story.author}</span>
            </div>

            <Badge>{(story.upvote_ratio * 100).toFixed(0)}% Rating</Badge>
          </div>
          <div className="mt-auto flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <FontAwesomeIcon icon={faClock} />
              <p>
                {calculateReadingTime(story.content, readingTime ?? 150)} mins
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <FontAwesomeIcon icon={faCalendar} />
              <p>
                {formatDistanceToNowStrict(new Date(story.created * 1000))} ago
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-foreground/70">
              <FontAwesomeIcon icon={faFolder} />
              <p>{story.subreddit}</p>
            </div>

            {story.flair && (
              <div className="flex items-center gap-2 text-xs text-foreground/70">
                <FontAwesomeIcon icon={faHashtag} />
                <p>{story.flair}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <footer className="flex flex-col items-center justify-end lg:flex-row">
        {list === "approved" && (
          <ApprovedItemActions postId={story.id} post={story} />
        )}
        {list === "completed" && <CompletedItemActions postId={story.id} />}
      </footer>
    </div>
  );
};

export default StoryListItem;
