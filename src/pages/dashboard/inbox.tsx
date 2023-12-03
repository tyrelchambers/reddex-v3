import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import { useDebouncedState, useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InboxMessageList from "~/components/InboxMessageList";
import SelectedInboxMessage from "~/components/SelectedInboxMessage";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { breakpoints } from "~/constants";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses } from "~/lib/styles";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Inbox = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useDebouncedState("", 200);
  const router = useRouter();
  const inboxQuery = api.inbox.all.useQuery();
  const searchInboxQuery = api.inbox.search.useQuery(search, {
    enabled: !!search,
    refetchOnWindowFocus: false,
  });

  const { width } = useViewportSize();

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
    trackUiEvent(MixpanelEvents.RESET_SEARCH_INPUT);
    setSearch("");
    if (searchRef.current) {
      searchRef.current.value = "";
    }
  };

  const backButton = () => {
    setSelectedMessageId(null);
  };

  return (
    <WrapperWithNav loading={inboxQuery.isLoading}>
      <div className="flex flex-col px-4 xl:px-0">
        <header className="mb-6 flex flex-col  justify-between gap-4 lg:flex-row lg:items-center">
          {width < breakpoints.desktop && selectedMessage && (
            <button onClick={backButton}>
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-4 text-foreground"
              />
              Back to Inbox
            </button>
          )}
          <h1 className="text-2xl text-foreground">Inbox</h1>
          <div className="flex w-full max-w-lg gap-4">
            <Input
              ref={searchRef}
              placeholder="Search for a message via author or subject"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="secondary" onClick={resetSearch}>
              Reset
            </Button>
          </div>
        </header>
        {width < breakpoints.laptop ? (
          <section className="my-2 flex gap-4">
            {!searchInboxQuery.isFetching ? (
              <>
                {!selectedMessage?.id && (
                  <InboxMessageList
                    messages={
                      searchInboxQuery.data ? searchInboxQuery.data : messages
                    }
                    selectedMessage={selectedMessage?.id}
                    setSelectedMessageId={setSelectedMessageId}
                    router={router}
                  />
                )}
                {selectedMessage?.id && (
                  <SelectedInboxMessage message={selectedMessage} />
                )}
              </>
            ) : (
              <Spinner />
            )}
          </section>
        ) : (
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
        )}
      </div>
    </WrapperWithNav>
  );
};

export default Inbox;
