import { Badge, Loader, Textarea } from "@mantine/core";
import { Contact } from "@prisma/client";
import React from "react";
import { useQueueStore } from "~/stores/queueStore";
import { PostFromReddit, RedditPostWithText } from "~/types";
import { api } from "~/utils/api";

interface ActiveQueueItemProps {
  post: PostFromReddit;
  contact: Contact | null | undefined;
}

interface Props {
  close: () => void;
}

const QueueModal = ({ close }: Props) => {
  const queueStore = useQueueStore();
  const currentPost = queueStore.queue[0];
  const apiContext = api.useContext();

  const redditPost = api.post.save.useMutation({
    onSuccess: () => {
      if (currentPost) {
        queueStore.remove(currentPost);
      }
    },
  });
  const contactMutation = api.contact.save.useMutation({
    onSuccess: () => {
      apiContext.contact.invalidate();
    },
  });

  if (!currentPost) return null;

  const contactQuery = api.contact.getByName.useQuery(currentPost.author, {
    enabled: !!currentPost,
  });

  const sendHandler = () => {
    // send message ->
    if (!currentPost) return;

    redditPost.mutate({
      ...currentPost,
      story_length: currentPost.selftext.length,
      flair: currentPost.link_flair_text,
      post_id: currentPost.id,
      reading_time: Math.round(currentPost.selftext.length / 200),
    } as unknown as RedditPostWithText);
  };

  if (!currentPost) return close();

  const saveContactHandler = () => {
    if (!currentPost) return;

    contactMutation.mutate({
      name: currentPost.author,
    });
  };

  return (
    <section>
      <ActiveQueueItem post={currentPost} contact={contactQuery.data} />

      <div className="mt-10 flex flex-col">
        <div className="flex items-baseline gap-4">
          <p className="font-bold">Message</p>

          <button className="button simple">Initial greeting</button>
          <button className="button simple">Recurring greeting</button>
        </div>
        <Textarea className="mt-2" />
      </div>

      <footer className="mt-6 flex justify-between">
        <div className="flex gap-3">
          <button className="button alt">Remove from queue</button>
          <button className="button secondary" onClick={saveContactHandler}>
            Add {redditPost.data?.author} to contacts
          </button>
        </div>

        <button
          type="button"
          className="button main"
          onClick={sendHandler}
          disabled={redditPost.isLoading}
        >
          {redditPost.isLoading ? <Loader size="sm" /> : "Send message"}
        </button>
      </footer>
    </section>
  );
};

const ActiveQueueItem = ({ post, contact }: ActiveQueueItemProps) => {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-col rounded-xl bg-gray-100 p-2">
        <p className="text-xs font-bold uppercase text-gray-500">Subject</p>
        <p className="mt-1 text-xl font-bold">{post.title}</p>
      </div>

      <div className="flex flex-col rounded-xl bg-gray-100 p-2">
        <p className="text-xs font-bold uppercase text-gray-500">Author</p>
        <p className="mt-1 text-xl font-bold">
          {post.author} {contact && <Badge>Is a contact</Badge>}
        </p>
      </div>
    </header>
  );
};

export default QueueModal;
