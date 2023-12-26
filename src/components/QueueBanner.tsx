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
    <div className="sticky top-2 my-6 flex flex-col items-center justify-between overflow-hidden rounded-xl bg-accent text-white shadow-xl lg:flex-row">
      <div className="py-3">
        <p className="text-sm">
          <span className="font-bold">{queueStore.queue.length}</span> items in
          queue
        </p>
      </div>
      <div className="flex w-full bg-black/20 p-2">
        <Button
          variant="ghost"
          className="!text-white"
          onClick={() => queueStore.clear()}
          size="xs"
        >
          Clear queue
        </Button>
        <Button
          type="button"
          variant="defaultInvert"
          size="xs"
          onClick={openQueue}
        >
          Open queue
        </Button>
      </div>
    </div>
  );
};

export default QueueBanner;
