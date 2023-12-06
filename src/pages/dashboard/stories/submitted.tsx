import {
  faCalendar,
  faCircleUser,
  faClock,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { formatReadingTime } from "~/utils";
import { api } from "~/utils/api";

const Submitted = () => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();
  const submittedStories = api.story.submittedList.useQuery();
  const deleteSubmittedStory = api.story.deleteSubmittedStory.useMutation({
    onSuccess: () => {
      apiContext.story.submittedList.invalidate();
    },
  });
  const profile = user?.Profile;
  const stories = submittedStories.data;

  const deleteHandler = (id: string) => {
    deleteSubmittedStory.mutate(id);
  };

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex flex-col">
        <header className="flex flex-col px-4 lg:px-0">
          <h1 className="text-2xl text-foreground">Submitted</h1>
          <p className="font-light text-muted-foreground">
            These are your stories submitted via your website.
          </p>
        </header>
        <div className="mt-10 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {stories?.map((story) => (
            <div
              key={story.id}
              className="flex flex-col overflow-hidden rounded-xl border-[1px] border-border bg-background shadow-md"
            >
              <header
                className={`flex flex-wrap items-center justify-between gap-3 bg-card p-3`}
              >
                <div className="flex items-center rounded-full text-sm text-card-foreground/70">
                  <FontAwesomeIcon icon={faCircleUser} className="mr-2" />
                  {story.author}
                </div>
              </header>
              <Link
                className=" block  p-3 font-bold text-foreground underline hover:text-rose-500"
                href={`/story/${story.id}`}
              >
                {story.title}
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
                <Button type="button" onClick={() => deleteHandler(story.id)}>
                  Delete
                </Button>
              </footer>
            </div>
          ))}
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Submitted;
