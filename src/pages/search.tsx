import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";
import SubredditSearchItem from "~/components/SubredditSearchItem";
import QueueBanner from "~/components/QueueBanner";
import QueueModal from "~/components/QueueModal";
import { db } from "~/utils/dexie";
import { FilterState, PostFromReddit } from "~/types";
import { useSession } from "next-auth/react";
import ActiveFilterList from "~/components/ActiveFilterList";
import { format } from "date-fns";
import EmptyState from "~/components/EmptyState";
import { buildParams, parseQuery } from "~/utils";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { filterPosts, paginatedSlice } from "~/utils/searchHelpers";
import { useSearchStore } from "~/stores/searchStore";
import queryString from "query-string";
import { Pagination } from "@mui/material";

const Search = () => {
  const {
    isSearching,
    loadingPosts,
    setLoadingPosts,
    page,
    setPage,
    filters,
    setFilters,
  } = useSearchStore();
  const router = useRouter();

  const session = useSession();
  const currentUser = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const usedPostIdsQuery = api.story.getUsedPostIds.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const [posts, setPosts] = useState<PostFromReddit[]>([]);
  const [lastSearched, setLastSearched] = useState<{ time: Date } | undefined>(
    undefined,
  );
  const [openQueue, setOpenQueue] = useState(false);

  const PAGINATION_LIMIT_PER_PAGE = 15;
  const PAGINATION_TOTAL_PAGES = Math.ceil(
    filterPosts(filters, posts, currentUser.data?.Profile?.words_per_minute)
      .length / PAGINATION_LIMIT_PER_PAGE,
  );

  useEffect(() => {
    const fn = async () => {
      setLoadingPosts(true);

      const posts = await db.posts.toArray();
      const lastSearchedTime = await db.lastSearched.toArray();

      setLastSearched(lastSearchedTime[0]);
      setPosts(posts);
      setLoadingPosts(false);
    };

    fn();

    return () => {
      setLoadingPosts(false);
    };
  }, [isSearching]);

  useEffect(() => {
    const search = queryString.parse(window.location.search);
    const parsedFilters = parseQuery(search);

    setFilters({ ...parsedFilters });
  }, [router.query]);

  const removeFilter = (filter: { label: string; value: string }) => {
    const filterClone = filters;
    if (!filterClone) return;

    delete filterClone[filter.value as keyof FilterState];

    const query = buildParams<Partial<FilterState>>(filterClone);
    router.replace(router.asPath, { query });
  };

  const resetFilters = () => {
    setFilters({});
    router.replace(router.asPath, { query: {} });
  };

  return (
    <>
      <Head>
        <title>Search | Reddex</title>
      </Head>

      <Header />

      {!isSearching && !loadingPosts && !posts.length && (
        <section className="mx-auto max-w-(--breakpoint-2xl)">
          <EmptyState label="subreddit posts" />
        </section>
      )}

      <div className="flex flex-col p-4">
        <QueueBanner openQueue={() => setOpenQueue(true)} />

        {(isSearching || loadingPosts) && (
          <div className="my-6 flex justify-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-primary" />
          </div>
        )}

        <ActiveFilterList
          filters={filters}
          removeFilter={removeFilter}
          reset={resetFilters}
        />

        <div className="mt-4 grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {(!isSearching &&
            !loadingPosts &&
            paginatedSlice(
              filterPosts(
                filters,
                posts,
                currentUser.data?.Profile?.words_per_minute,
              ),
              PAGINATION_LIMIT_PER_PAGE,
              page,
            )
              .sort((a, b) => b.created - a.created)
              .map((item) => (
                <SubredditSearchItem
                  key={item.id}
                  post={item}
                  hasBeenUsed={
                    !!usedPostIdsQuery.data?.find(
                      (id) => id.post_id === item.id,
                    )
                  }
                  usersWordsPerMinute={
                    currentUser.data?.Profile?.words_per_minute
                  }
                  canAddToQueue={session.status === "authenticated" || false}
                />
              ))) ||
            null}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 lg:flex-row">
          <div className="flex flex-col gap-1">
            {lastSearched && (
              <p className="text-foreground/70 text-sm font-medium lg:mb-0">
                Last searched:{" "}
                {format(lastSearched.time, "MMMM do, yyyy hh:mm aa")}
              </p>
            )}
            {posts && (
              <p className="text-foreground/60 mt-4 text-sm italic lg:mt-0">
                *The default words per minute is set at 150wpm.
              </p>
            )}
          </div>
          <footer className="mt-4 flex justify-center">
            <Pagination
              count={PAGINATION_TOTAL_PAGES}
              page={page}
              onChange={(_, page) => setPage(page)}
            />
          </footer>
        </div>
      </div>

      <Dialog open={openQueue} onOpenChange={setOpenQueue}>
        <DialogContent className="w-full max-w-(--breakpoint-lg)">
          <DialogHeader>
            <DialogTitle>Story queue</DialogTitle>
          </DialogHeader>
          <QueueModal close={() => setOpenQueue(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Search;
