import { faAddressBook, faUserPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RedditInboxMessage } from "~/types";

interface Props {
  isContact: boolean;
  message: RedditInboxMessage;
  addContactHandler: (params: RedditInboxMessage["dest"]) => void;
}

const MessageContact = ({ isContact, message, addContactHandler }: Props) => {
  return !isContact ? (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs text-card-foreground"
      onClick={() => addContactHandler(message.dest)}
      title={`Add ${message.dest} to contacts`}
    >
      <FontAwesomeIcon icon={faUserPlus} />
    </button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs text-white">
            <FontAwesomeIcon icon={faAddressBook} />
          </span>
        </TooltipTrigger>
        <TooltipContent>{message.dest} is already a contact</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MessageContact;
