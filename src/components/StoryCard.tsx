import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SubmittedStory } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import SummarizeStory from "./SummarizeStory";
import { calculateReadingTime } from "~/lib/utils";
import { faCalendar, faClock } from "@fortawesome/pro-light-svg-icons";

interface Props {
  story: SubmittedStory;
}

const StoryCard = ({ story }: Props) => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();
  const profile = user?.Profile;

  const deleteSubmittedStory = api.story.deleteSubmittedStory.useMutation({
    onSuccess: () => {
      apiContext.story.submittedList.invalidate();
    },
  });

  const restoreSubmittedStory = api.story.restoreSubmittedStory.useMutation({
    onSuccess: () => {
      apiContext.story.submittedList.invalidate();
    },
  });

  const deleteHandler = (id: string) => {
    deleteSubmittedStory.mutate(id);
  };

  const restoreStoryHandler = (id: string) => {
    restoreSubmittedStory.mutate(id);
  };

  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-5 shadow-lg">
      <header className={`mb-2 flex gap-6`}>
        <div className="-mt-2 flex flex-col gap-2">
          <Link
            className="text-xl font-bold text-foreground underline hover:text-rose-500"
            href={`/story/${story.id}`}
            target="_blank"
          >
            {story.title || "<This story is missing a title>"}
          </Link>
          <div className="flex items-center rounded-full text-sm text-foreground">
            <span className="font-foreground/70 text-xs">by</span>{" "}
            <span className="ml-1 font-semibold">{story.author}</span>
          </div>
        </div>
      </header>

      <div className="mt-auto flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <FontAwesomeIcon icon={faClock} />
          <p>
            {calculateReadingTime(story.body, profile?.words_per_minute ?? 200)}{" "}
            mins
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground/70">
          <FontAwesomeIcon icon={faCalendar} />
          <p>{formatDistanceToNowStrict(story.date)} ago</p>
        </div>
      </div>
      <footer className="flex flex-col items-center justify-end lg:flex-row">
        <div className="mt-4 flex items-end gap-2 lg:mt-0">
          <SummarizeStory postId={story.id} text={story.body} />
          {story.deleted_at ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => restoreStoryHandler(story.id)}
            >
              Restore
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={() => deleteHandler(story.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default StoryCard;
