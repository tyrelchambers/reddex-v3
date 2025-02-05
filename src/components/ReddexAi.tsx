import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faCommentDots,
  faSpinner,
} from "@fortawesome/pro-solid-svg-icons";
import { api } from "~/utils/api";
import { copyToClipboard } from "~/utils/copyToClipboard";
import { Skeleton } from "./ui/skeleton";

const ReddexAi = ({ story }: { story: string }) => {
  const reddexai = api.reddexai.talk.useMutation();
  const [input, setInput] = useState("");

  const sendPrebuilt = (str: string) => {
    reddexai.mutate({
      input: str,
      story,
    });
  };

  return (
    <section>
      <h3 className="text-2xl font-medium">Talk to ReddexAI</h3>
      <p className="text-muted-foreground">
        Talk to Reddex AI and ask questions about the story in question.
      </p>

      <div className="bg-card mt-4 rounded-lg p-4">
        <Label>Input</Label>
        <div className="flex flex-col gap-2 md:flex-row">
          <Input
            placeholder="Type your question or command here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="button"
            disabled={reddexai.isPending}
            onClick={() => sendPrebuilt(input)}
          >
            {reddexai.isPending ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Ask"
            )}
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("generate a thumbnail prompt")}
            className="text-xs"
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Generate a thumbnail prompt
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("give me a title")}
            className="text-xs"
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Give me a title
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("give me a youtube summary")}
            className="text-xs"
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Give me a Youtube summary
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("suggest hashtags for youtube")}
            className="text-xs"
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Suggest hashtags
          </Button>
        </div>

        <div className="mt-10">
          <p className="text-foreground mt-2 font-semibold">Chat</p>
          {reddexai.isPending ? (
            <Skeleton className="bg-background h-[200px] w-full" />
          ) : reddexai.data ? (
            <div>
              <p className="text-foreground mt-2 font-mono">{reddexai.data}</p>
              <footer>
                <button
                  type="button"
                  className="bg-background text-muted-foreground mt-2 flex w-fit items-center gap-2 rounded-md p-2 text-xs font-medium"
                  onClick={() => copyToClipboard(reddexai.data)}
                >
                  <FontAwesomeIcon icon={faClipboard} />
                  Copy
                </button>
              </footer>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ReddexAi;
