import React, { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faInputText,
  faSpinner,
  faSquareBinary,
  faTag,
  faUser,
} from "@fortawesome/pro-solid-svg-icons";

import { Badge } from "./ui/badge";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Separator } from "./ui/separator";
import ReddexAi from "./ReddexAi";
import { AiResponse } from "~/server/schemas";

const parseSummary = (summary: string) => {
  return JSON.parse(summary) as AiResponse;
};

const SummarizeStory = ({ text, postId }: { postId: string; text: string }) => {
  const summarize = api.story.summarize.useMutation();
  const [open, setOpen] = useState(false);

  const parsedSummary = useMemo(() => {
    if (summarize.data) {
      setOpen(true);
      return parseSummary(summarize.data);
    }
  }, [summarize.data]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  const handleSummarize = () => {
    summarize.mutate({ body: text, postId });
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      {/* button exists outside trigger or else dialog opens before there's content */}
      <Button
        type="button"
        className="flex items-center gap-2"
        size="sm"
        variant="secondary"
        onClick={handleSummarize}
        title="Summarize story"
        disabled={summarize.isPending}
      >
        {summarize.isPending ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          <FontAwesomeIcon icon={faSquareBinary} />
        )}
      </Button>

      {open && parsedSummary && (
        <div className="fixed inset-0 z-50 h-screen overflow-y-auto bg-background">
          <header className="flex w-full items-center justify-between border-b border-border py-2">
            <p className="px-4 font-semibold text-foreground">
              Summarize Story
            </p>
            <button type="button" onClick={close}>
              <FontAwesomeIcon
                icon={faTimes}
                className="border-l border-border p-4 text-xl"
              />
            </button>
          </header>
          <div className="mx-auto my-20 flex max-w-screen-xl flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl bg-card p-4">
                <header className="mb-2 flex items-center gap-4">
                  <FontAwesomeIcon icon={faUser} />
                  <h3 className="font-medium text-foreground">Characters</h3>
                </header>
                <div className="flex flex-wrap gap-1">
                  {parsedSummary.characters.map((c, idx) => (
                    <Badge key={c + idx}>{c}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-card p-4">
                <header className="mb-2 flex items-center gap-4">
                  <FontAwesomeIcon icon={faTag} />
                  <h3 className="font-medium">Topics/themes</h3>
                </header>
                <div className="flex flex-wrap gap-1">
                  {parsedSummary.topics.map((c, idx) => (
                    <Badge key={c + idx}>{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="mb-2 font-medium text-foreground">
                <FontAwesomeIcon icon={faInputText} className="mr-2" />
                Summary
              </h3>
              <p className="text-muted-foreground">{parsedSummary.summary}</p>
            </div>

            <div>
              <h3 className="font-medium text-foreground">
                <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
                Grade
              </h3>
              <p className="mb-2 text-sm text-muted-foreground">
                Grade is a measure of the quality of the story. 1 is the lowest
                score and 10 is the highest.
              </p>
              <p className="text-3xl font-bold">{parsedSummary.grade}</p>
            </div>
            <Separator className="my-10 bg-border" />
            <ReddexAi story={text} />
          </div>
        </div>
      )}
    </>
  );
};

export default SummarizeStory;
