import { Pagination } from "@mantine/core";
import { SubmittedStory } from "@prisma/client";
import React, { useState } from "react";
import StoryCard from "~/components/StoryCard";
import { mantinePaginationStyles } from "~/lib/styles";

interface Props {
  stories: SubmittedStory[];
  regex: RegExp;
}

const UnreadStories = ({ stories, regex }: Props) => {
  const [page, setPage] = useState(1);
  const PAGINATION_LIMIT_PER_PAGE = 8;
  const PAGINATION_TOTAL_PAGES = Math.ceil(
    stories.filter(
      (item) =>
        (item.title?.match(regex) || item.author?.match(regex)) &&
        !item.deleted_at,
    ).length / PAGINATION_LIMIT_PER_PAGE,
  );

  const storyList = stories
    ?.filter(
      (item) =>
        (item.title?.match(regex) || item.author?.match(regex)) &&
        !item.deleted_at,
    )
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(
      (page - 1) * PAGINATION_LIMIT_PER_PAGE,
      page * PAGINATION_LIMIT_PER_PAGE,
    )
    .map((story) => <StoryCard key={story.id} story={story} />);

  return (
    <section className="mt-4 flex w-full flex-col">
      <div className="mb-6 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {storyList}
      </div>
      <Pagination
        classNames={mantinePaginationStyles}
        value={page}
        onChange={setPage}
        total={PAGINATION_TOTAL_PAGES}
      />
    </section>
  );
};

export default UnreadStories;
