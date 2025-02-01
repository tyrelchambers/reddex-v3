import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faSpinner } from "@fortawesome/pro-solid-svg-icons";
import { api } from "~/utils/api";

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

      <div className="mt-4 rounded-lg bg-card p-4">
        <Label>Input</Label>
        <div className="flex gap-2">
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
        <div className="mt-2 flex gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("generate a thumbnail prompt")}
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Generate a thumbnail prompt
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("give me a title")}
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Give me a title
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("give me a youtube summary")}
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Give me a Youtube summary
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => sendPrebuilt("suggest hashtags for youtube")}
          >
            <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
            Suggest hashtags
          </Button>
        </div>

        <div className="mt-10">
          <p className="mt-2 font-semibold text-foreground">Chat</p>
        </div>
      </div>
    </section>
  );
};

export default ReddexAi;
