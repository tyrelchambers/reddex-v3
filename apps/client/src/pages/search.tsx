"use client";
import { Drawer, Loader, Modal, Pagination } from "@mantine/core";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import SubredditSearchForm from "~/forms/SubredditSearchForm";
import Header from "~/layouts/Header";
import { useDisclosure } from "@mantine/hooks";
import { api } from "~/utils/api";
import SubredditSearchItem from "~/components/SubredditSearchItem";
import QueueBanner from "~/components/QueueBanner";
import FilterSelections from "~/components/FilterSelections";
import QueueModal from "~/components/QueueModal";
import { db } from "~/utils/dexie";
import { FilterState, PostFromReddit } from "~/types";
import { useSession } from "next-auth/react";
import {
  mantineDrawerClasses,
  mantineModalClasses,
  mantinePaginationStyles,
} from "~/lib/styles";
import { FilterPosts } from "~/lib/utils";
import ActiveFilterList from "~/components/ActiveFilterList";
import { format } from "date-fns";
import EmptyState from "~/components/EmptyState";
import { addLastSearchedOrUpdate, buildParams, parseQuery } from "~/utils";
import { useSubscribed } from "~/hooks/useSubscribed";
import { useRouter } from "next/router";
import queryString from "query-string";
interface SearchHandlerProps {
  subreddit: string;
  category: string;
}

const Search = () => {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] =
    useState<Partial<FilterState> | null>(null);
  const [activePage, setPage] = useState(1);
  const session = useSession();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const { activeSub } = useSubscribed();
  const statsUpdate = api.stats.set.useMutation();
  const currentUser = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const subredditSearch = api.subredditSearch.search.useMutation({
    async onSuccess(data) {
      await db.posts.clear();
      await db.posts.bulkAdd(data);
      await addLastSearchedOrUpdate();
      statsUpdate.mutate(data.length);
      closeDrawer();
    },
  });
  const usedPostIdsQuery = api.story.getUsedPostIds.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostFromReddit[]>([]);
  const [lastSearched, setLastSearched] = useState<{ time: Date } | undefined>(
    undefined
  );
  const [queueModalOpened, { open: openQueue, close: closeQueue }] =
    useDisclosure(false);

  const PAGINATION_LIMIT_PER_PAGE = 15;
  const PAGINATION_TOTAL_PAGES =
    filterPosts(
      appliedFilters,
      posts,
      currentUser.data?.Profile?.words_per_minute
    ).length / PAGINATION_LIMIT_PER_PAGE;

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      const posts = await db.posts.toArray();
      const lastSearchedTime = await db.lastSearched.toArray();

      setLastSearched(lastSearchedTime[0]);
      setPosts(posts);
      setLoading(false);
    };

    fn();

    return () => {
      setLoading(false);
    };
  }, [subredditSearch.isSuccess]);

  useEffect(() => {
    const search = queryString.parse(window.location.search);
    setAppliedFilters({ ...parseQuery(search) });
  }, [router.query]);

  const searchHandler = (data: SearchHandlerProps) => {
    if (!data.subreddit) return;

    subredditSearch.mutate(data);
  };

  const removeFilter = (filter: { label: string; value: string }) => {
    const filterClone = appliedFilters;
    if (!filterClone) return;

    delete filterClone[filter.value as keyof FilterState];

    const query = buildParams<Partial<FilterState>>(filterClone);
    router.replace(router.asPath, { query });
  };

  const resetFilters = () => {
    setAppliedFilters({});
    router.replace(router.asPath, { query: {} });
  };

  return (
    <>
      <Head>
        <title>Reddex | Search</title>
      </Head>
      <main>
        <Header openDrawer={openDrawer} />

        {!loading && !posts.length && (
          <section className="mx-auto max-w-screen-2xl">
            <EmptyState label="subreddit posts" />
          </section>
        )}

        <div className=" relative flex flex-col p-4">
          <QueueBanner openQueue={openQueue} />

          {loading && (
            <div className="my-6 flex justify-center">
              <Loader color="pink" />
            </div>
          )}

          <ActiveFilterList
            filters={appliedFilters}
            removeFilter={removeFilter}
            reset={resetFilters}
          />

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {(!loading &&
              paginatedSlice(
                filterPosts(
                  appliedFilters,
                  posts,
                  currentUser.data?.Profile?.words_per_minute
                ),
                PAGINATION_LIMIT_PER_PAGE,
                activePage
              )
                .sort((a, b) => b.created - a.created)
                .map((item) => (
                  <SubredditSearchItem
                    key={item.id}
                    post={item}
                    hasBeenUsed={
                      !!usedPostIdsQuery.data?.find(
                        (id) => id.post_id === item.id
                      )
                    }
                    usersWordsPerMinute={
                      currentUser.data?.Profile?.words_per_minute
                    }
                    canAddToQueue={
                      session.status === "authenticated" && activeSub
                    }
                  />
                ))) ||
              null}
          </div>
          <div className="my-6 flex flex-col justify-between lg:flex-row">
            {lastSearched && (
              <p className="mb-4 text-sm text-foreground/70 lg:mb-0">
                Last searched:{" "}
                {format(lastSearched.time, "MMMM do, yyyy hh:mm aa")}
              </p>
            )}
            <Pagination
              classNames={mantinePaginationStyles}
              value={activePage}
              onChange={setPage}
              total={PAGINATION_TOTAL_PAGES}
            />
          </div>
        </div>

        <Modal
          opened={opened}
          onClose={close}
          title="Add filters"
          classNames={mantineModalClasses}
        >
          <p className="mb-4 text-sm text-foreground/60">
            Any input that doesn&apos;t have a value, won&apos;t be applied.
          </p>
          <FilterSelections filters={appliedFilters} />
        </Modal>

        <Modal
          opened={queueModalOpened}
          onClose={closeQueue}
          size="xl"
          title="Story queue"
          classNames={mantineModalClasses}
        >
          <QueueModal close={closeQueue} />
        </Modal>
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          title="Search Reddit"
          position="right"
          classNames={mantineDrawerClasses}
        >
          <SubredditSearchForm
            open={open}
            searchHandler={searchHandler}
            disableSearch={subredditSearch.isLoading}
            searches={currentUser.data?.Profile?.searches}
          />
        </Drawer>
      </main>
    </>
  );
};

const paginatedSlice = (
  array: PostFromReddit[],
  page_size: number,
  page_number: number
) => {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

const filterPosts = (
  filters: Partial<FilterState> | null,
  posts: PostFromReddit[],
  profileReadingTime: number | undefined | null
) => {
  if (!filters) return posts;

  const newArray: PostFromReddit[] = [];

  for (let index = 0; index < posts.length; index++) {
    const element = posts[index];

    if (!element) continue;

    const post = new FilterPosts(element, filters);
    const acceptance: boolean[] = [];

    if (element?.author.includes("[deleted]")) continue;

    const obj: {
      [k in keyof FilterState as string]: () => boolean | undefined | null;
    } = {
      keywords: () => post.keywords(),
      upvotes: () => post.upvotes(),
      readingTime: () => post.readingTime(profileReadingTime ?? 200),
      seriesOnly: () => post.seriesOnly(),
      excludeSeries: () => post.excludeSeries(),
    };

    Object.keys(filters).forEach((key) => {
      const result = obj[key]?.();

      if (result !== undefined && result !== null) {
        acceptance.push(result);
      }
    });

    if (element && acceptance.every((item) => item)) {
      newArray.push(element);
    }
  }

  return newArray;
};

export default Search;
