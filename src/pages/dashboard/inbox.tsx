import React from "react";
import InboxBody from "~/components/dashboard/inbox/InboxBody";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { api } from "~/utils/api";

const Inbox = () => {
  const inboxQuery = api.inbox.all.useQuery();

  return (
    <WrapperWithNav className="flex w-full" loading={inboxQuery.isPending}>
      <section className="flex h-[calc(100vh-124px)] flex-1 gap-4">
        <InboxBody
          loading={inboxQuery.isPending}
          allMessages={inboxQuery.data || []}
        />
      </section>
    </WrapperWithNav>
  );
};

export default Inbox;
