import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format, fromUnixTime } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { routes } from "~/routes";
import { MixpanelEvents, RedditInboxMessage } from "~/types";
import { trackUiEvent } from "~/utils/mixpanelClient";
import InboxHeader from "./dashboard/inbox/InboxHeader";

interface Props {
  messages: RedditInboxMessage[];
  selectedMessage: RedditInboxMessage["id"] | undefined;
  setSelectedMessageId: (id: string) => void;
  search: string;
  setSearch: (search: string) => void;
}

const InboxMessageList = ({
  messages,
  setSelectedMessageId,
  selectedMessage,
  search,
  setSearch,
}: Props) => {
  const router = useRouter();
  const resetSearch = () => {
    trackUiEvent(MixpanelEvents.RESET_SEARCH_INPUT);
    setSearch("");
  };

  return (
    <div className="flex w-full flex-col overflow-auto p-4 xl:max-w-sm">
      <InboxHeader
        search={search}
        setSearch={setSearch}
        resetSearch={resetSearch}
      />
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
            className={`inbox-message-list-item p-4 transition-all ${
              m.id === selectedMessage ? "active" : ""
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
