import {
  faAdd,
  faCalendar,
  faCircleUser,
  faFolder,
  faThumbsUp,
  faUp,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type RedditStory } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { useQueueStore } from "~/stores/queueStore";

interface Props {
  post: RedditStory;
}

const SubredditSearchItem = ({ post }: Props) => {
  const queueStore = useQueueStore();

  const isInQueue = queueStore.exists(post);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border-[1px] border-gray-200 bg-white">
      <header
        className={`mb-2 flex items-center justify-between gap-3 bg-gradient-to-b ${
          isInQueue ? "from-green-300" : "from-gray-300"
        } to-transparent p-3 py-5`}
      >
        <div className="flex items-center rounded-full  font-black text-orange-500">
          <FontAwesomeIcon icon={faUp} className="mr-2" />
          {post.ups}
        </div>

        <div className="flex gap-3">
          <div className="flex items-center rounded-full text-sm text-gray-500">
            <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
            {post.author}
          </div>

          <div className="flex items-center rounded-full text-sm text-gray-500">
            <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
            {(post.upvote_ratio * 100).toFixed(0)}%
          </div>
        </div>
      </header>
      <Link
        className="  p-3 font-bold text-gray-800 underline hover:text-rose-500"
        href={post.url}
        target="_blank"
      >
        {post.title}
      </Link>

      <footer className="mt-auto flex items-end justify-between p-3">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FontAwesomeIcon icon={faFolder} />
            <p>{post.subreddit}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FontAwesomeIcon icon={faCalendar} />
            <p>
              {formatDistanceToNowStrict(new Date(post.created * 1000))} ago
            </p>
          </div>
        </div>

        {isInQueue ? (
          <button
            type="button"
            className="button secondary h-8 !bg-gray-100 p-2 text-xs font-bold !text-gray-500 !shadow-none"
            onClick={() => queueStore.remove(post)}
          >
            Remove from queue
          </button>
        ) : (
          <button
            type="button"
            className="button secondary h-8 p-2 text-xs font-bold"
            onClick={() => queueStore.add(post)}
          >
            <FontAwesomeIcon icon={faAdd} className="mr-2" />
            Add to Queue
          </button>
        )}
      </footer>
    </div>
  );
};

export default SubredditSearchItem;
