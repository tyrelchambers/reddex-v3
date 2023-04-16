import React from "react";
import { useQueueStore } from "~/stores/queueStore";

const QueueBanner = () => {
  const queueStore = useQueueStore();

  if (queueStore.queue.length === 0) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4 rounded-xl bg-indigo-500 p-2 text-white shadow-xl">
      <p className="text-lg">
        <span className="font-bold">{queueStore.queue.length}</span> items in
        queue
      </p>
      <button
        type="button"
        className="rounded-lg bg-white px-4 py-2 text-sm text-indigo-500 shadow-gray-600 transition-all hover:bg-gray-100 hover:shadow-md"
      >
        Open queue
      </button>
    </div>
  );
};

export default QueueBanner;
