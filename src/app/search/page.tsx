"use client";
import { Loader, Modal } from "@mantine/core";
import Head from "next/head";
import React, { useEffect, useReducer, useState } from "react";
import SubredditSearchForm from "~/forms/SubredditSearchForm";
import Header from "~/layouts/Header";
import { useDisclosure } from "@mantine/hooks";
import { type FilterState, filterReducer } from "~/reducers/filterReducer";
import { api } from "~/utils/api";
import SubredditSearchItem from "~/components/SubredditSearchItem";
import QueueBanner from "~/components/QueueBanner";
import FilterSelections from "~/components/FilterSelections";
import QueueModal from "~/components/QueueModal";
import { db } from "~/utils/dexie";
import { PostFromReddit } from "~/types";
import { useSession } from "next-auth/react";
interface SearchHandlerProps {
  subreddit: string;
  category: string;
}

const Search = () => {
  const session = useSession();
  const currentUser = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const subredditSearch = api.subredditSearch.search.useMutation({
    async onSuccess(data) {
      await db.posts.clear();
      await db.posts.bulkAdd(data);
    },
  });
  const usedPostIdsQuery = api.post.getUsedPostIds.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });

  const [loading, setLoading] = useState(false);
  // const savedPosts = useLiveQuery(() => db.posts.toArray());
  const [savedPosts, setSavedPosts] = useState<PostFromReddit[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [queueModalOpened, { open: openQueue, close: closeQueue }] =
    useDisclosure(false);

  const [filters, dispatch] = useReducer(filterReducer, {
    upvotes: {
      qualifier: "Over",
      value: 0,
    },
    readingTime: {
      qualifier: "Over",
      value: 0,
    },
    keywords: undefined,
    seriesOnly: false,
    excludeSeries: false,
  } as FilterState);

  useEffect(() => {
    const fn = async () => {
      setLoading(true);

      const posts = await db.posts.toArray();
      setSavedPosts(posts);
      setLoading(false);
    };

    fn();

    return () => {
      setLoading(false);
    };
  }, [subredditSearch.isSuccess]);

  const searchHandler = (data: SearchHandlerProps) => {
    subredditSearch.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Reddex | Search</title>
      </Head>
      <main>
        <Header />

        <div className=" relative flex flex-col p-4">
          <div className="mx-auto w-full max-w-screen-lg gap-3 rounded-xl bg-white p-2 ">
            <SubredditSearchForm
              open={open}
              searchHandler={searchHandler}
              disableSearch={subredditSearch.isLoading}
              searches={currentUser.data?.Profile?.searches}
            />
          </div>

          <QueueBanner openQueue={openQueue} />

          {loading && (
            <div className="my-6 flex justify-center">
              <Loader color="pink" />
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-6">
            {(!loading &&
              savedPosts?.map((item) => (
                <SubredditSearchItem
                  key={item.id}
                  post={item}
                  hasBeenUsed={
                    !!usedPostIdsQuery.data?.find(
                      (id) => id.post_id === item.id
                    )
                  }
                />
              ))) ||
              null}
          </div>
        </div>

        <Modal
          opened={opened}
          onClose={close}
          title="Add filters"
          classNames={{ title: "font-bold" }}
        >
          <p className="mb-4 text-sm text-gray-700">
            Any input that doesn&apos;t have a value, won&apos;t be applied.
          </p>
          <FilterSelections filters={filters} dispatch={dispatch} />
        </Modal>

        <Modal
          opened={queueModalOpened}
          onClose={closeQueue}
          size="xl"
          title="Story queue"
          classNames={{
            title: "font-black",
          }}
        >
          <QueueModal close={closeQueue} />
        </Modal>
      </main>
    </>
  );
};

export default Search;
