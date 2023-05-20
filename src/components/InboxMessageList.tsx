import { format, fromUnixTime } from "date-fns";
import { NextRouter } from "next/router";
import React from "react";
import { routes } from "~/routes";
import { RedditInboxMessage } from "~/types";

interface Props {
  messages: RedditInboxMessage[];
  selectedMessage: RedditInboxMessage["id"] | undefined;
  setSelectedMessageId: (id: string) => void;
  router: NextRouter;
}

const InboxMessageList = ({
  messages,
  setSelectedMessageId,
  selectedMessage,
  router,
}: Props) => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 overflow-auto border-r-[1px] border-gray-200 pr-6">
      {messages.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            setSelectedMessageId(m.id);
            router.push(routes.INBOX, {
              search: `message=${m.id}`,
            });
          }}
        >
          <div
            className={`inbox-message-list-item rounded-2xl p-4 transition-all ${
              m.id === selectedMessage ? "active" : "bg-gray-50"
            }`}
          >
            <p className="text-left font-semibold text-gray-700">{m.subject}</p>
            <footer className="mt-4 flex justify-between">
              <p className="text-sm font-thin text-gray-500">{m.dest}</p>
              <p className="text-sm font-thin text-gray-500">
                {format(fromUnixTime(m.created), "MMM do, yyyy")}
              </p>
            </footer>
          </div>
        </button>
      ))}
    </div>
  );
};

export default InboxMessageList;
