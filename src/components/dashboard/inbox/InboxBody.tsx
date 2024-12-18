import { useViewportSize } from "@mantine/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import InboxMessageList from "~/components/InboxMessageList";
import SelectedInboxMessage from "~/components/SelectedInboxMessage";
import Spinner from "~/components/Spinner";
import { breakpoints } from "~/constants";
import { RedditInboxMessage } from "~/types";
import { api } from "~/utils/api";

const InboxBody = ({
  loading,
  allMessages,
}: {
  loading: boolean;
  allMessages: RedditInboxMessage[];
}) => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const searchInboxQuery = api.inbox.search.useQuery(search, {
    enabled: !!search,
    refetchOnWindowFocus: false,
  });
  const messages = useMemo(
    () => searchInboxQuery.data || allMessages || [],
    [searchInboxQuery.data, allMessages],
  );
  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedMessageId),
    [selectedMessageId, messages],
  );

  useEffect(() => {
    if (router.isReady && router.query["message"]) {
      setSelectedMessageId(router.query["message"] as string);
    }
  }, [router.query, router.isReady]);

  const { width } = useViewportSize();
  const isDesktop = width > breakpoints.laptop;

  const handleBack = async () => {
    // need to await this or else the above useEffect will trigger and grab the query before it's removed
    await router.replace(router.asPath, { query: {} });
    setSelectedMessageId("");
  };

  return (
    <section className="flex w-full gap-4">
      {!loading ? (
        <>
          {isDesktop ? (
            <>
              <InboxMessageList
                messages={messages}
                selectedMessage={selectedMessage?.id}
                setSelectedMessageId={setSelectedMessageId}
                search={search}
                setSearch={setSearch}
                searching={searchInboxQuery.isFetching}
              />
              <SelectedInboxMessage message={selectedMessage} />
            </>
          ) : (
            <>
              {!selectedMessage?.id && (
                <InboxMessageList
                  messages={messages}
                  selectedMessage={selectedMessage?.id}
                  setSelectedMessageId={setSelectedMessageId}
                  search={search}
                  setSearch={setSearch}
                  searching={searchInboxQuery.isFetching}
                />
              )}
              {selectedMessage?.id && (
                <SelectedInboxMessage
                  handleBack={handleBack}
                  message={selectedMessage}
                />
              )}
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </section>
  );
};

export default InboxBody;
