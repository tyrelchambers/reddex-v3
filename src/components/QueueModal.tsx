import { Badge, Loader, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Contact } from "@prisma/client";
import React, { useEffect } from "react";
import { useQueueStore } from "~/stores/queueStore";
import { PostFromReddit, RedditPostWithText } from "~/types";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { mantineInputClasses } from "~/lib/styles";

interface ActiveQueueItemProps {
  post: PostFromReddit;
  contact: Contact | null | undefined;
}

interface Props {
  close: () => void;
}

const QueueModal = ({ close }: Props) => {
  const userQuery = api.user.me.useQuery();
  const queueStore = useQueueStore();
  const currentPost = queueStore.queue[0];
  const apiContext = api.useContext();
  const contactedWritersQuery = api.user.contactedWriters.useQuery();

  const redditPost = api.story.save.useMutation({
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

  const contactQuery = api.contact.getByName.useQuery(currentPost?.author, {
    enabled: !!currentPost,
  });

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  useEffect(() => {
    const currentPostAuthor = currentPost?.author;
    const contactedAuthors = contactedWritersQuery.data?.map(
      (item) => item.name
    );

    if (currentPostAuthor) {
      if (contactedAuthors && contactedAuthors.includes(currentPostAuthor)) {
        form.setValues({ message: userQuery.data?.Profile?.recurring || "" });
      } else {
        form.setValues({ message: userQuery.data?.Profile?.greeting || "" });
      }
    }
  }, [currentPost]);

  useEffect(() => {
    if (!currentPost) return close();
  }, [currentPost]);

  if (!currentPost) return null;

  const sendHandler = () => {
    // send message ->
    if (!currentPost) return;

    redditPost.mutate({
      ...currentPost,
      content: currentPost.selftext,
      story_length: currentPost.selftext.length,
      flair: currentPost.link_flair_text,
      post_id: currentPost.id,
      reading_time: Math.round(currentPost.selftext.length / 200),
      message: form.values.message,
    });
  };

  const saveContactHandler = () => {
    if (!currentPost) return;

    contactMutation.mutate({
      name: currentPost.author,
    });
  };

  const removeFromQueue = () => {
    queueStore.remove(currentPost);
  };

  const fillWithMessage = (message: string | null | undefined) => {
    form.setValues({
      message: message ?? "",
    });
  };

  return (
    <section>
      <ActiveQueueItem post={currentPost} contact={contactQuery.data} />

      <div className="mt-10 flex flex-col">
        <div className="flex items-baseline gap-4">
          <p className="font-bold text-foreground">Message</p>

          <Button
            variant="link"
            onClick={() => fillWithMessage(userQuery.data?.Profile?.recurring)}
          >
            Initial greeting
          </Button>
          <Button
            variant="link"
            onClick={() => fillWithMessage(userQuery.data?.Profile?.greeting)}
          >
            Recurring greeting
          </Button>
        </div>
        <Textarea
          className="mt-2"
          variant="filled"
          minRows={8}
          classNames={mantineInputClasses}
          {...form.getInputProps("message")}
        />
      </div>

      <footer className="mt-6 flex justify-between">
        <div className="flex gap-3">
          <Button variant="secondary" onClick={removeFromQueue}>
            Remove from queue
          </Button>
          <Button variant="secondary" onClick={saveContactHandler}>
            Add {currentPost?.author} to contacts
          </Button>
        </div>

        <Button
          type="button"
          onClick={sendHandler}
          disabled={redditPost.isLoading}
        >
          {redditPost.isLoading ? <Loader size="sm" /> : "Send message"}
        </Button>
      </footer>
    </section>
  );
};

const ActiveQueueItem = ({ post, contact }: ActiveQueueItemProps) => {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-col rounded-xl bg-card p-2">
        <p className="text-xs font-normal uppercase text-card-foreground">
          Subject
        </p>
        <p className="mt-1 text-xl font-bold text-card-foreground">
          {post.title}
        </p>
      </div>

      <div className="flex flex-col rounded-xl bg-card p-2">
        <p className="text-xs font-normal uppercase text-card-foreground">
          Author
        </p>
        <p className="mt-1 text-xl font-bold text-card-foreground">
          {post.author} {contact && <Badge>Is a contact</Badge>}
        </p>
      </div>
    </header>
  );
};

export default QueueModal;
