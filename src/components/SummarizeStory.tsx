import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSquareBinary } from "@fortawesome/pro-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { AiResponse } from "~/utils/openai-helpers";
import { Badge } from "./ui/badge";

const SummarizeStory = ({ text, postId }: { postId: string; text: string }) => {
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const summarize = api.story.summarize.useMutation({
    onSuccess: () => {
      setSummaryOpen(true);
    },
  });

  const handleSummarize = () => {
    summarize.mutate({ body: text, postId });
  };

  const parseSummary = (summary: string) => {
    return JSON.parse(summary) as AiResponse;
  };

  const renderText = (text: any) => {
    if (text instanceof Array) {
      return text.map((t) => (
        <Badge key={t as string} variant="outline">
          {t}
        </Badge>
      ));
    }
    return text as string;
  };

  const description = (label: string) => {
    switch (label) {
      case "grade":
        return "A grade of how well the story is written. This takes into consideration the writing style, grammar and spelling mistakes. A grade of 1 is the worst and a grade of 10 is the best.";
      default:
        return "";
    }
  };

  return (
    <>
      <Button
        type="button"
        className="flex items-center gap-2"
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

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="w-full max-w-6xl">
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
            <DialogDescription>
              The summary uses AI to try and extract useful information about
              this story including characters, summary, topics and a grade.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex h-[400px]">
            {summarize.data && (
              <div className="flex flex-col gap-4">
                {Object.entries(parseSummary(summarize.data)).map(
                  ([key, value]) => (
                    <div key={key} className="rounded-lg bg-card p-4">
                      <h3 className="font-semibold capitalize text-foreground">
                        {key}
                      </h3>
                      {description(key) && (
                        <p className="mb-2 text-xs text-muted-foreground">
                          {description(key)}
                        </p>
                      )}
                      <p className="mt-2">{renderText(value)}</p>
                    </div>
                  ),
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setSummaryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SummarizeStory;
