import { faAddressBook, faUserPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import AddContactModal from "~/components/modals/AddContactModal";
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
}

const MessageContact = ({ isContact, message }: Props) => {
  return !isContact ? (
    <AddContactModal name={message.dest}>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs text-card-foreground"
        title={`Add ${message.dest} to contacts`}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    </AddContactModal>
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
