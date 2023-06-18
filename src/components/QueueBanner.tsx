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
    <div className="sticky top-2 my-6 flex items-center justify-center gap-4 rounded-xl bg-accent/90 p-2 text-white shadow-xl">
      <p className="text-sm">
        <span className="font-bold">{queueStore.queue.length}</span> items in
        queue
      </p>
      <Button type="button" variant="defaultInvert" onClick={openQueue}>
        Open queue
      </Button>
      <Button variant="ghost" onClick={() => queueStore.clear()}>
        Clear queue
      </Button>
    </div>
  );
};

export default QueueBanner;
