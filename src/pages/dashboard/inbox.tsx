import { useViewportSize } from "@mantine/hooks";
import React from "react";
import InboxBody from "~/components/dashboard/inbox/InboxBody";
import { breakpoints } from "~/constants";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { api } from "~/utils/api";

const Inbox = () => {
  const inboxQuery = api.inbox.all.useQuery();

  const { width } = useViewportSize();

  return (
    <WrapperWithNav className="flex w-full" loading={inboxQuery.isPending}>
      {width < breakpoints.laptop ? (
        <section className="my-2 flex gap-4">
          <InboxBody
            loading={inboxQuery.isPending}
            allMessages={inboxQuery.data || []}
          />
        </section>
      ) : (
        <section className="flex h-[calc(100vh-120px)] flex-1 gap-4">
          <InboxBody
            loading={inboxQuery.isPending}
            allMessages={inboxQuery.data || []}
          />
        </section>
      )}
    </WrapperWithNav>
  );
};

export default Inbox;
