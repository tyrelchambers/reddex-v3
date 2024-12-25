import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faComment,
  faHeart,
  faRetweet,
} from "@fortawesome/pro-regular-svg-icons";
import { generateTweetLink } from "~/utils";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

interface Props {
  username: string | null | undefined;
  count: number | undefined;
  description: string | undefined;
}
const StatShareDialog = ({ username, description, count }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full md:w-fit">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your stats</DialogTitle>
          <DialogDescription>
            Show your stats with everyone! Show off what you&apos;ve
            accomplished!
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 flex gap-4 rounded-3xl border border-border p-4">
          <Avatar>
            <AvatarFallback className="text-foreground">SA</AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col">
            <p className="text-foreground">{username}</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>

            <footer className="mt-6 flex justify-between text-muted-foreground">
              <FontAwesomeIcon icon={faComment} />
              <FontAwesomeIcon icon={faRetweet} />
              <FontAwesomeIcon icon={faHeart} />
              <FontAwesomeIcon icon={faChartSimple} />
            </footer>
          </div>
        </div>

        {count !== undefined && description && (
          <a
            href={generateTweetLink({
              text: description,
            })}
            className="w-full"
            target="_blank"
          >
            <Button className="w-full">
              <FontAwesomeIcon icon={faTwitter} className="mr-3" />
              Share on Twitter
            </Button>
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StatShareDialog;
