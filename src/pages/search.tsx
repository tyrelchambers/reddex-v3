import { Modal } from "@mantine/core";
import Head from "next/head";
import React, { useCallback, useReducer } from "react";
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
import { useLiveQuery } from "dexie-react-hooks";
interface SearchHandlerProps {
  subreddit: string;
  category: string;
}

const Search = () => {
  const savedPosts = useLiveQuery(() => db.posts.toArray());

  const subredditSearch = api.subredditSearch.search.useMutation({
    async onSuccess(data) {
      await db.posts.clear();
      await db.posts.bulkAdd(data);
    },
  });

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
            />
          </div>

          <QueueBanner openQueue={openQueue} />

          <div className="mt-6 grid grid-cols-3 gap-6">
            {savedPosts?.map((item) => (
              <SubredditSearchItem key={item.id} post={item} />
            )) || null}
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
