import { Loader } from "@mantine/core";
import React, { useCallback, useMemo, useState } from "react";
import InboxMessageList from "~/components/InboxMessageList";
import SelectedInboxMessage from "~/components/SelectedInboxMessage";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const Inbox = () => {
  const inboxQuery = api.inbox.all.useQuery();
  const messages = inboxQuery.data?.data.children.flatMap((d) => d.data) || [];
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const selectedMessage = useMemo(
    () => messages.find((m) => m.id === selectedMessageId),
    [selectedMessageId]
  );

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-3xl">Inbox</h1>

        {inboxQuery.isFetching ? (
          <div className="my-20 flex w-full flex-col items-center">
            <Loader color="indigo" />
            <p className="mt-4 text-xl text-indigo-500">Loading inbox...</p>
          </div>
        ) : (
          <section className="my-2 flex gap-4">
            <InboxMessageList
              messages={messages}
              selectedMessage={selectedMessage?.id}
              setSelectedMessageId={setSelectedMessageId}
            />
            <SelectedInboxMessage message={selectedMessage} />
          </section>
        )}
      </main>
    </>
  );
};

export default Inbox;
