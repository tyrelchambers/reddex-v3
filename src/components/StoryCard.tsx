import {
  faCalendar,
  faCircleUser,
  faClock,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Profile, SubmittedStory } from "@prisma/client";
import { format, formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
import { formatReadingTime } from "~/utils";
import { Button } from "./ui/button";
import { api } from "~/utils/api";
import SummarizeStory from "./SummarizeStory";

interface Props {
  story: SubmittedStory;
  profile: Profile | undefined | null;
}

const StoryCard = ({ story, profile }: Props) => {
  const apiContext = api.useUtils();

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
    <div
      key={story.id}
      className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-background shadow-md"
    >
      <header
        className={`flex flex-wrap items-center justify-between gap-3 bg-card p-3`}
      >
        <div className="flex items-center rounded-full text-sm text-card-foreground/70">
          <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
          {story.author || "Unknown"}
        </div>

        {story.deleted_at && (
          <p className="flex items-center gap-2 text-xs text-card-foreground/60">
            <FontAwesomeIcon icon={faCalendar} /> Deleted on{" "}
            {format(story.deleted_at as Date, "MMM do, yyyy")}
          </p>
        )}
      </header>
      <Link
        className="block p-3 font-bold text-foreground underline hover:text-rose-500"
        href={`/story/${story.id}`}
      >
        {story.title || "<This story has title>"}
      </Link>

      <div className="flex gap-3 p-2 px-4">
        <div className="flex items-center gap-2 text-xs text-card-foreground/70">
          <FontAwesomeIcon icon={faCalendar} />
          <p>{formatDistanceToNowStrict(story.date)} ago</p>
        </div>

        {profile?.words_per_minute && (
          <div className="flex items-center gap-2 text-xs text-card-foreground/70">
            <FontAwesomeIcon icon={faClock} />
            <p>
              {formatReadingTime(story.body, profile?.words_per_minute)}
              min
            </p>
          </div>
        )}
      </div>
      <footer className="mt-auto flex flex-wrap items-center justify-end gap-4 border-t border-border p-3">
        <SummarizeStory postId={story.id} text={story.body} />
        {story.deleted_at ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => restoreStoryHandler(story.id)}
          >
            Restore
          </Button>
        ) : (
          <Button type="button" onClick={() => deleteHandler(story.id)}>
            Delete
          </Button>
        )}
      </footer>
    </div>
  );
};

export default StoryCard;
