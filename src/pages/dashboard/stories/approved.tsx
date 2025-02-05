import { Pagination } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import StoryCardBody from "~/components/dashboard/storyCard/body";
import StoryCardDetails from "~/components/dashboard/storyCard/details";
import { StoryCardPermissionFooter } from "~/components/dashboard/storyCard/footer";
import StoryCardHeader from "~/components/dashboard/storyCard/header";
import StoryCardInfo from "~/components/dashboard/storyCard/mainInfo";
import StoryCard from "~/components/dashboard/storyCard/StoryCard";
import Ups from "~/components/dashboard/storyCard/ups";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import ImportStoryForm from "~/forms/ImportStoryForm";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Approved = () => {
  const profile = api.user.me.useQuery();
  const wpm = profile.data?.Profile?.words_per_minute;

  const { data } = useSession();
  const [page, setPage] = useState(1);

  const approvedListQuery = api.story.getApprovedList.useQuery();

  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");

  const PAGINATION_LIMIT_PER_PAGE = 8;
  const PAGINATION_TOTAL_PAGES = approvedListQuery.data
    ? Math.ceil(
        approvedListQuery.data?.filter(
          (item) =>
            (item.title?.match(regex) || item.author?.match(regex)) &&
            !item.deleted_at,
        ).length / PAGINATION_LIMIT_PER_PAGE,
      )
    : 0;

  const storyList = approvedListQuery.data
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
              flair={story.flair}
              subreddit={story.subreddit}
            />
          </StoryCardInfo>
        </StoryCardBody>
        <StoryCardPermissionFooter list="approved" story={story} />
      </StoryCard>
    ));

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <div className="flex w-full flex-col px-4">
        {" "}
        <header className="flex flex-1 flex-col justify-between lg:px-0 xl:flex-row">
          <div className="mb-6 flex flex-col xl:mb-0">
            <h1 className="text-foreground text-2xl font-bold">
              Approved list
            </h1>
            <p className="text-muted-foreground font-light">
              Your list of stories for which you have permission to read.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md">
            <Input
              placeholder="Search by keywords"
              value={query}
              className="w-full"
              onChange={(e) => setQuery(e.currentTarget.value)}
            />

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="bg-card text-foreground"
                  onClick={() => {
                    trackUiEvent(MixpanelEvents.IMPORT_STORY, {
                      userId: data?.user.id,
                    });
                  }}
                >
                  Import story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import a story</DialogTitle>
                </DialogHeader>
                <ImportStoryForm />
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {storyList}
        </div>
        <footer className="mt-4 flex justify-center">
          <Pagination
            count={PAGINATION_TOTAL_PAGES}
            page={page}
            onChange={(_, page) => setPage(page)}
          />
        </footer>
      </div>
    </WrapperWithNav>
  );
};

export default Approved;
