import { Pagination } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import StoryCardBody from "~/components/dashboard/storyCard/body";
import StoryCardDetails from "~/components/dashboard/storyCard/details";
import { StoryCardPermissionFooter } from "~/components/dashboard/storyCard/footer";
import StoryCardHeader from "~/components/dashboard/storyCard/header";
import StoryCardInfo from "~/components/dashboard/storyCard/mainInfo";
import StoryCard, {
  StoryCardSkeleton,
} from "~/components/dashboard/storyCard/StoryCard";
import Ups from "~/components/dashboard/storyCard/ups";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Completed = () => {
  const { data } = useSession();
  const [page, setPage] = useState(1);
  const profile = api.user.me.useQuery();
  const wpm = profile.data?.Profile?.words_per_minute;

  const apiContext = api.useUtils();
  const completedListQuery = api.story.getCompletedList.useQuery(undefined, {
    select(data) {
      return data.filter((item) => !item.deleted_at);
    },
  });
  const removeAll = api.story.removeAllFromCompletedList.useMutation({
    onSuccess: () => {
      apiContext.story.getCompletedList.invalidate();
    },
  });
  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");
  const PAGINATION_LIMIT_PER_PAGE = 8;
  const PAGINATION_TOTAL_PAGES = completedListQuery.data
    ? Math.ceil(
        completedListQuery.data?.filter(
          (item) =>
            (item.title?.match(regex) || item.author?.match(regex)) &&
            !item.deleted_at,
        ).length / PAGINATION_LIMIT_PER_PAGE,
      )
    : 0;

  const storyList = completedListQuery.data
    ?.filter(
      (item) =>
        (item.title?.match(regex) || item.author?.match(regex)) &&
        !item.deleted_at,
    )
    ?.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    )
    .slice(
      (page - 1) * PAGINATION_LIMIT_PER_PAGE,
      page * PAGINATION_LIMIT_PER_PAGE,
    )
    .map((story) => (
      <StoryCard key={story.id}>
        <StoryCardBody>
          <Ups ups={story.ups} />
          <StoryCardInfo>
            <StoryCardHeader
              author={story.author}
              url={story.url}
              title={story.title}
            />
            <StoryCardDetails
              body={story.content}
              wpm={wpm}
              dateCreated={story.created}
              upvote_ratio={story.upvote_ratio}
            />
          </StoryCardInfo>
        </StoryCardBody>
        <StoryCardPermissionFooter list="completed" story={story} />
      </StoryCard>
    ));

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex w-full flex-col px-4">
        <header className="flex w-full flex-1 flex-col justify-between gap-2 lg:flex-row lg:px-0">
          <div className="flex flex-col">
            <h1 className="text-foreground text-2xl font-bold">
              Completed list
            </h1>
            <p className="text-muted-foreground font-light">
              Your list of stories for which you have read.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md">
            <Input
              placeholder="Search by keywords"
              value={query}
              className="w-full"
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <Button
              variant="secondary"
              className="bg-card"
              onClick={() => {
                trackUiEvent(MixpanelEvents.REMOVE_ALL_COMPLETED_STORIES, {
                  userId: data?.user?.id,
                });
                removeAll.mutate();
              }}
            >
              Remove all
            </Button>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {completedListQuery.isFetching ? (
            <>
              <StoryCardSkeleton />
              <StoryCardSkeleton />
              <StoryCardSkeleton />
              <StoryCardSkeleton />
            </>
          ) : (
            storyList
          )}
        </div>

        <footer className="mt-4 flex justify-center">
          <Pagination
            count={PAGINATION_TOTAL_PAGES}
            page={page}
            onChange={(_, page) => setPage(page)}
          />
        </footer>
      </section>
    </WrapperWithNav>
  );
};

export default Completed;
