import { Loader, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InboxMessageList from "~/components/InboxMessageList";
import SelectedInboxMessage from "~/components/SelectedInboxMessage";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { mantineInputClasses } from "~/lib/styles";
import { api } from "~/utils/api";

const Inbox = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useDebouncedState("", 200);
  const router = useRouter();
  const inboxQuery = api.inbox.all.useQuery();
  const searchInboxQuery = api.inbox.search.useQuery(search, {
    enabled: !!search,
    refetchOnWindowFocus: false,
  });

  const messages = useMemo(
    () => searchInboxQuery.data || inboxQuery.data || [],
    [searchInboxQuery.data, inboxQuery.data]
  );

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedMessageId),
    [selectedMessageId, messages]
  );

  useEffect(() => {
    if (router.isReady && router.query["message"]) {
      setSelectedMessageId(router.query["message"] as string);
    }
  }, [router.query, router.isReady]);

  const resetSearch = () => {
    setSearch("");
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        {inboxQuery.isLoading ? (
          <div className="my-20 flex w-full flex-col items-center">
            <Loader color="rose" />
            <p className="mt-4 text-xl text-rose-500">Loading inbox...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <header className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl text-foreground">Inbox</h1>
              <div className="flex gap-4">
                <TextInput
                  ref={searchRef}
                  placeholder="Search for a message via author or subject"
                  classNames={mantineInputClasses}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="secondary" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </header>
            <section className="my-2 flex h-[calc(100vh-250px)]  gap-4">
              {!searchInboxQuery.isFetching ? (
                <>
                  <InboxMessageList
                    messages={
                      searchInboxQuery.data ? searchInboxQuery.data : messages
                    }
                    selectedMessage={selectedMessage?.id}
                    setSelectedMessageId={setSelectedMessageId}
                    router={router}
                  />
                  <SelectedInboxMessage message={selectedMessage} />
                </>
              ) : (
                <Spinner />
              )}
            </section>
          </div>
        )}
      </main>
    </>
  );
};

export default Inbox;
