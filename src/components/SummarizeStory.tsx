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
import { useRouter } from "next/router";

const parseSummary = (summary: string) => {
  return JSON.parse(summary) as AiResponse;
};

const SummarizeStory = ({ text, postId }: { postId: string; text: string }) => {
  const router = useRouter();
  const summarize = api.story.summarize.useMutation();
  const [open, setOpen] = useState(false);

  const parsedSummary = useMemo(() => {
    if (summarize.data) {
      setOpen(true);
      return parseSummary(summarize.data);
    }
  }, [summarize.data]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");

      router.beforePopState(() => {
        setOpen(false);
        return false;
      });
    }

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
        <div className="bg-background fixed inset-0 z-50 h-screen overflow-y-auto">
          <header className="border-border flex w-full items-center justify-between border-b py-2">
            <p className="text-foreground px-4 font-semibold">
              Summarize Story
            </p>
            <button
              type="button"
              onClick={close}
              className="hover:cursor-pointer"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="border-border border-l p-4 text-xl"
              />
            </button>
          </header>
          <div className="mx-auto my-20 flex max-w-(--breakpoint-xl) flex-col gap-4 p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="bg-card rounded-xl p-4">
                <header className="mb-2 flex items-center gap-4">
                  <FontAwesomeIcon icon={faUser} />
                  <h3 className="text-foreground font-medium">Characters</h3>
                </header>
                <div className="flex flex-wrap gap-1">
                  {parsedSummary.characters.map((c, idx) => (
                    <Badge key={c + idx}>{c}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-4">
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
              <h3 className="text-foreground mb-2 font-medium">
                <FontAwesomeIcon icon={faInputText} className="mr-2" />
                Summary
              </h3>
              <p className="text-muted-foreground">{parsedSummary.summary}</p>
            </div>

            <div>
              <h3 className="text-foreground font-medium">
                <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
                Grade
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                Grade is a measure of the quality of the story. 1 is the lowest
                score and 10 is the highest.
              </p>
              <p className="text-3xl font-bold">{parsedSummary.grade}</p>
            </div>
            <Separator className="bg-border my-10" />
            <ReddexAi story={text} />
          </div>
        </div>
      )}
    </>
  );
};

export default SummarizeStory;
