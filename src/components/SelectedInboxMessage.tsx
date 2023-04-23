import { faReply, faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider } from "@mantine/core";
import { fromUnixTime } from "date-fns";
import Link from "next/link";
import { format } from "date-fns";
import React from "react";
import { FormattedMessagesList, RedditInboxMessage } from "~/types";
import { formatInboxMessagesToList } from "~/utils/formatInboxMessagesToList";

interface Props {
  message: RedditInboxMessage | undefined;
}

const SelectedInboxMessage = ({ message }: Props) => {
  if (!message) return null;

  const formattedMessages = formatInboxMessagesToList(message);

  return (
    <div className="h-[calc(100vh-220px)] flex-1 overflow-auto">
      <header className="w-full">
        <p className="text-2xl font-bold text-gray-700">{message.subject}</p>
        <footer className="mt-3 flex items-center gap-10 ">
          <p className="flex items-center gap-2 text-gray-500">
            <FontAwesomeIcon icon={faUserCircle} />
            {message.dest}
          </p>

          <div className=" flex gap-4">
            <button type="button" className="button alt">
              Add to contacts
            </button>
            <button type="button" className="button secondary">
              Add to reading list
            </button>
          </div>
        </footer>
      </header>

      <Divider className="my-10" />

      <section className="my-10 flex flex-col gap-10">
        {formattedMessages.map((msg) => (
          <InboxMessageReply message={msg} key={msg.created} />
        ))}
      </section>
    </div>
  );
};

const InboxMessageReply = ({ message }: { message: FormattedMessagesList }) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <header className="mb-2 flex items-baseline justify-between">
        <p className="mb-2 text-xl font-bold text-gray-700">
          {message.isReply && (
            <FontAwesomeIcon icon={faReply} className="mr-4 text-indigo-500" />
          )}
          {message.author}
        </p>
        <p className=" font-thin text-gray-800">
          {format(fromUnixTime(message.created), "MMM do, yyyy")}
        </p>
      </header>
      <p className="whitespace-pre-wrap font-thin text-gray-700">
        {message.body}
      </p>
    </div>
  );
};

export default SelectedInboxMessage;
