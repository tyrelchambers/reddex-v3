import React from "react";
import StoryCard from "~/components/StoryCard";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Submitted = () => {
  const { data: user } = api.user.me.useQuery();
  const submittedStories = api.story.submittedList.useQuery();

  const profile = user?.Profile;
  const stories = submittedStories.data;

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex w-full flex-col px-4">
        <header className="flex flex-col lg:px-0">
          <h1 className="text-2xl font-bold text-foreground">Submitted</h1>
          <p className="font-light text-muted-foreground">
            These are your stories submitted via your website.
          </p>
        </header>
        <div className="mt-10 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {stories
            ?.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((story) => (
              <StoryCard key={story.id} profile={profile} story={story} />
            ))}
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Submitted;
