import {
  faCalendar,
  faClock,
  faFolder,
  faHashtag,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDistanceToNowStrict } from "date-fns";
import React from "react";
import { Badge } from "~/components/ui/badge";
import { calculateReadingTime } from "~/lib/utils";

interface Props {
  body: string;
  wpm: number | null | undefined;
  dateCreated: number;
  subreddit?: string;
  flair?: string | null | undefined;
  upvote_ratio?: number;
}

const StoryCardDetails = ({
  body,
  wpm,
  dateCreated,
  subreddit,
  flair,
  upvote_ratio,
}: Props) => {
  return (
    <div className="mt-auto mb-4 flex flex-wrap gap-3">
      {upvote_ratio && (
        <Badge className="w-fit">
          {(upvote_ratio * 100).toFixed(0)}% Rating
        </Badge>
      )}
      <div className="text-foreground/70 flex items-center gap-2 text-xs">
        <FontAwesomeIcon icon={faClock} />
        <p>{calculateReadingTime(body, wpm ?? 200)} mins</p>
      </div>
      <div className="text-foreground/70 flex items-center gap-2 text-xs">
        <FontAwesomeIcon icon={faCalendar} />
        <p>{formatDistanceToNowStrict(new Date(dateCreated * 1000))} ago</p>
      </div>
      {subreddit && (
        <div className="text-foreground/70 flex items-center gap-2 text-xs">
          <FontAwesomeIcon icon={faFolder} />
          <p>{subreddit}</p>
        </div>
      )}

      {flair && (
        <div className="text-foreground/70 flex items-center gap-2 text-xs">
          <FontAwesomeIcon icon={faHashtag} />
          <p>{flair}</p>
        </div>
      )}
    </div>
  );
};

export default StoryCardDetails;
