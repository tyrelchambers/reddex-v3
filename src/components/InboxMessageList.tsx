import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, fromUnixTime } from "date-fns";
import { NextRouter } from "next/router";
import React from "react";
import { routes } from "~/routes";
import { MixpanelEvents, RedditInboxMessage } from "~/types";
import { trackUiEvent } from "~/utils/mixpanelClient";

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
    <div className="flex w-full max-w-sm flex-col gap-4 overflow-auto border-r-[1px] border-border pr-6">
      {messages.map((m) => (
        <button
          key={m.id}
          onClick={() => {
            trackUiEvent(MixpanelEvents.SELECT_INBOX_MESSAGE);
            setSelectedMessageId(m.id);
            router.push(routes.INBOX, {
              search: `message=${m.id}`,
            });
          }}
        >
          <div
            className={`inbox-message-list-item rounded-2xl p-4 transition-all ${
              m.id === selectedMessage ? "active" : "border border-border"
            }`}
          >
            <p className="text-left font-medium text-foreground">{m.subject}</p>
            <footer className="mt-4 flex justify-between">
              <p className="text-sm font-thin text-muted-foreground">
                <FontAwesomeIcon icon={faUserCircle} className="mr-1" />{" "}
                {m.dest}
              </p>
              <p className="text-sm font-thin text-muted-foreground">
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
