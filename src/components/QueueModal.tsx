import { Textarea } from "@mantine/core";
import { RedditStory } from "@prisma/client";
import React from "react";
import { useQueueStore } from "~/stores/queueStore";

interface ActiveQueueItemProps {
  post: RedditStory;
}

interface Props {
  close: () => void;
}

const QueueModal = ({ close }: Props) => {
  const queueStore = useQueueStore();
  const currentPost = queueStore.queue[0];

  const sendHandler = () => {
    // send message ->
    queueStore.remove(currentPost);
  };

  if (!currentPost) return close();

  return (
    <section>
      <ActiveQueueItem post={currentPost} />

      <div className="mt-10 flex flex-col">
        <div className="flex items-baseline gap-4">
          <p className="font-bold">Message</p>

          <button className="button simple">Initial greeting</button>
          <button className="button simple">Recurring greeting</button>
        </div>
        <Textarea className="mt-2" />
      </div>

      <footer className="mt-6 flex justify-between">
        <button className="button alt">Remove from queue</button>

        <button type="button" className="button main" onClick={sendHandler}>
          Send message
        </button>
      </footer>
    </section>
  );
};

const ActiveQueueItem = ({ post }: ActiveQueueItemProps) => {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-col rounded-xl bg-gray-100 p-2">
        <p className="text-xs font-bold uppercase text-gray-500">Subject</p>
        <p className="mt-1 text-xl font-bold">{post.title}</p>
      </div>

      <div className="flex flex-col rounded-xl bg-gray-100 p-2">
        <p className="text-xs font-bold uppercase text-gray-500">Author</p>
        <p className="mt-1 text-xl font-bold">{post.author}</p>
      </div>
    </header>
  );
};

export default QueueModal;
