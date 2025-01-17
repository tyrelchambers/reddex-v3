import React, { useMemo } from "react";
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

const parseSummary = (summary: string) => {
  return JSON.parse(summary) as AiResponse;
};

const SummarizeStory = ({ text, postId }: { postId: string; text: string }) => {
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const summarize = api.story.summarize.useMutation({
    onSuccess: () => {
      setSummaryOpen(true);
    },
  });

  const parsedSummary = useMemo(() => {
    if (summarize.data) {
      return parseSummary(summarize.data);
    }
  }, [summarize.data]);

  const handleSummarize = () => {
    summarize.mutate({ body: text, postId });
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

      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent className="w-full max-w-6xl">
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
            <DialogDescription>
              The summary uses AI to try and extract useful information about
              this story including characters, summary, topics and a grade.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[400px] lg:h-auto">
            {parsedSummary && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl bg-card p-4">
                    <header className="mb-2 flex items-center gap-4">
                      <FontAwesomeIcon icon={faUser} />
                      <h3 className="font-medium text-foreground">
                        Characters
                      </h3>
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
                  <p className="text-muted-foreground">
                    {parsedSummary.summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground">
                    <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
                    Grade
                  </h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Grade is a measure of the quality of the story. 1 is the
                    lowest score and 10 is the highest.
                  </p>
                  <p className="text-3xl font-bold">{parsedSummary.grade}</p>
                </div>
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
