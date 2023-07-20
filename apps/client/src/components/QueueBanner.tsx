import React from "react";
import { useQueueStore } from "~/stores/queueStore";
import { Button } from "./ui/button";

interface Props {
  openQueue: () => void;
}

const QueueBanner = ({ openQueue }: Props) => {
  const queueStore = useQueueStore();

  if (queueStore.queue.length === 0) return null;

  return (
    <div className="sticky top-2 my-6 flex flex-col items-center justify-between gap-4 rounded-xl bg-accent p-2  px-4 text-white shadow-xl lg:flex-row">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <p className="text-sm">
          <span className="font-bold">{queueStore.queue.length}</span> items in
          queue
        </p>
        <Button type="button" variant="defaultInvert" onClick={openQueue}>
          Open queue
        </Button>
      </div>
      <Button
        variant="ghost"
        className="!text-white"
        onClick={() => queueStore.clear()}
      >
        Clear queue
      </Button>
    </div>
  );
};

export default QueueBanner;
