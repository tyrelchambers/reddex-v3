import { SubmittedStory } from "@prisma/client";
import React, { useState } from "react";
import StoryCard from "~/components/dashboard/storyCard/StoryCard";
import Pagination from "@mui/material/Pagination";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import StoryCardBody from "../storyCard/body";
import StoryCardInfo from "../storyCard/mainInfo";
import StoryCardHeader from "../storyCard/header";
import StoryCardDetails from "../storyCard/details";
import { SubmittedStoryFooter } from "../storyCard/footer";
import { getUnixTime } from "date-fns";

interface Props {
  stories: SubmittedStory[];
  regex: RegExp;
}

const ReadStories = ({ stories, regex }: Props) => {
  const apiCtx = api.useUtils();
  const profile = api.user.me.useQuery();
  const wpm = profile.data?.Profile?.words_per_minute;
  const permanentDelete = api.story.deleteSubmittedStory.useMutation({
    onSuccess: () => {
      apiCtx.story.submittedList.invalidate();
    },
  });
  const [page, setPage] = useState(1);

  const filteredStories = stories?.filter(
    (item) =>
      (item.title?.match(regex) || item.author?.match(regex)) &&
      item.read &&
      !item.deleted_at,
  );

  const PAGINATION_LIMIT_PER_PAGE = 8;
  const PAGINATION_TOTAL_PAGES = Math.ceil(
    filteredStories.length / PAGINATION_LIMIT_PER_PAGE,
  );

  const storyList = filteredStories
    ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(
      (page - 1) * PAGINATION_LIMIT_PER_PAGE,
      page * PAGINATION_LIMIT_PER_PAGE,
    )
    .map((story) => (
      <StoryCard key={story.id}>
        <StoryCardBody>
          <StoryCardInfo>
            <StoryCardHeader
              author={story.author}
              url={`/story/${story.id}`}
              title={story.title}
            />
            <StoryCardDetails
              body={story.body}
              wpm={wpm}
              dateCreated={getUnixTime(new Date(story.date))}
            />
          </StoryCardInfo>
        </StoryCardBody>
        <SubmittedStoryFooter
          extraActions={
            <Button
              variant="destructive"
              size="sm"
              onClick={() => permanentDelete.mutate(story.id)}
            >
              Permanent delete
            </Button>
          }
          story={story}
        />
      </StoryCard>
    ));

  return (
    <section className="mt-4 flex w-full flex-col">
      <div className="mb-6 grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {storyList}
      </div>
      <footer className="flex justify-center">
        <Pagination
          count={PAGINATION_TOTAL_PAGES}
          page={page}
          onChange={(_, page) => setPage(page)}
        />
      </footer>
    </section>
  );
};

export default ReadStories;
