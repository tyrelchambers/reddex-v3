import { faBook, faBookmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ListEnum } from "~/components/SelectedInboxMessage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RedditInboxMessage } from "~/types";

interface Props {
  postIsInReadingList: number;
  addStoryToReadingList: () => void;
  message: RedditInboxMessage;
}

const MessageReadingList = ({
  postIsInReadingList,
  addStoryToReadingList,
  message,
}: Props) => {
  const listName = (list: ListEnum) => {
    if (list === ListEnum.approvedList) {
      return "in approved list";
    } else if (list === ListEnum.completedList) {
      return "this story has been read";
    }
  };

  return postIsInReadingList === -1 ? (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-xs text-card-foreground"
      onClick={addStoryToReadingList}
      title={`Add ${message.subject} to reading list`}
    >
      <FontAwesomeIcon icon={faBookmark} />
    </button>
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span className="flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-green-500 px-3 text-xs font-medium text-white">
            <FontAwesomeIcon icon={faBook} className="mr-2" />

            {listName(postIsInReadingList)}
          </span>
        </TooltipTrigger>
        <TooltipContent>This story is in your reading list</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MessageReadingList;
