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
    <div className="sticky top-20 my-6 flex flex-col items-center justify-between overflow-hidden rounded-xl bg-primary text-white shadow-xl md:flex-row lg:top-2">
      <div className="flex-1 py-3 md:px-3">
        <p className="text-sm">
          <span className="font-bold">{queueStore.queue.length}</span> items in
          queue
        </p>
      </div>
      <div className="flex w-full bg-black/20 p-2 md:w-fit md:bg-transparent">
        <Button
          variant="ghost"
          className="!text-white"
          onClick={() => queueStore.clear()}
          size="xs"
          type="button"
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
