import { Loader, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import InboxMessageList from "~/components/InboxMessageList";
import SelectedInboxMessage from "~/components/SelectedInboxMessage";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const Inbox = () => {
  const router = useRouter();
  const inboxQuery = api.inbox.all.useQuery();
  const messages = useMemo(
    () => inboxQuery.data?.data.children.flatMap((d) => d.data) || [],
    [inboxQuery.data?.data.children]
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

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        {inboxQuery.isLoading ? (
          <div className="my-20 flex w-full flex-col items-center">
            <Loader color="indigo" />
            <p className="mt-4 text-xl text-indigo-500">Loading inbox...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <header className="mb-6 flex items-center justify-between">
              <h1 className="h1 text-3xl">Inbox</h1>
              <TextInput placeholder="Search for a message" className="w-96" />
            </header>
            <section className="my-2 flex h-[calc(100vh-250px)]  gap-4">
              <InboxMessageList
                messages={messages}
                selectedMessage={selectedMessage?.id}
                setSelectedMessageId={setSelectedMessageId}
                router={router}
              />
              <SelectedInboxMessage message={selectedMessage} />
            </section>
          </div>
        )}
      </main>
    </>
  );
};

export default Inbox;
