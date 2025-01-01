import React, { useState } from "react";
import StoryCard from "~/components/StoryCard";
import { Input } from "~/components/ui/input";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Submitted = () => {
  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");
  const { data: user } = api.user.me.useQuery();
  const submittedStories = api.story.submittedList.useQuery();

  const profile = user?.Profile;
  const stories = submittedStories.data;

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex w-full flex-col px-4">
        <header className="flex w-full flex-1 flex-col justify-between gap-2 lg:flex-row lg:px-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">Submitted</h1>
            <p className="font-light text-muted-foreground">
              These are your stories submitted via your website.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md">
            <Input
              placeholder="Search by keywords"
              value={query}
              className="w-full"
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          </div>
        </header>
        <div className="mt-10 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
          {stories
            ?.filter(
              (item) => item.title?.match(regex) || item.author?.match(regex),
            )
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
