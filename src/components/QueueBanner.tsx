import React from "react";
import { useQueueStore } from "~/stores/queueStore";

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
      <button
        type="button"
        className="rounded-lg bg-white px-4 py-2 text-sm text-accent/90 shadow-gray-600 transition-all hover:bg-gray-100 hover:shadow-md"
        onClick={openQueue}
      >
        Open queue
      </button>
    </div>
  );
};

export default QueueBanner;
