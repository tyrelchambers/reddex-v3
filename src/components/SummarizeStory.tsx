import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSquareBinary } from "@fortawesome/pro-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const SummarizeStory = ({ text }: { text: string }) => {
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const summarize = api.story.summarize.useMutation({
    onSuccess: () => {
      setSummaryOpen(true);
    },
  });

  const handleSummarize = () => {
    summarize.mutate({ body: text });
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summary</DialogTitle>
          </DialogHeader>

          <p className="text-muted-foreground">{summarize.data}</p>

          <DialogFooter>
            <Button onClick={() => setSummaryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SummarizeStory;
