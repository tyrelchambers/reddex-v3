import { faUserCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { RedditInboxMessage } from "~/types";

interface Props {
  message: RedditInboxMessage | undefined;
}

const SelectedInboxMessage = ({ message }: Props) => {
  if (!message) return null;

  return (
    <div className="flex-1">
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

      <section></section>
    </div>
  );
};

const InboxMessageReply = () => {
  return <div></div>;
};

export default SelectedInboxMessage;
