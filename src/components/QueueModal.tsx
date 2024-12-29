import { Contact } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useQueueStore } from "~/stores/queueStore";
import { PostFromReddit } from "~/types";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { Form, FormField } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLoader } from "@fortawesome/pro-regular-svg-icons";
import { Badge } from "./ui/badge";

interface ActiveQueueItemProps {
  post: PostFromReddit;
  contact: Contact | null | undefined;
}

interface Props {
  close: () => void;
}

const QueueModal = ({ close }: Props) => {
  const { data: user } = api.user.me.useQuery();
  const queueStore = useQueueStore();
  const currentPost = queueStore.queue[0];
  const apiContext = api.useUtils();
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
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    const currentPostAuthor = currentPost?.author;
    const contactedAuthors = contactedWritersQuery.data?.map(
      (item) => item.name,
    );

    if (currentPostAuthor) {
      if (contactedAuthors && contactedAuthors.includes(currentPostAuthor)) {
        form.setValue("message", user?.Profile?.recurring || "");
      } else {
        form.setValue("message", user?.Profile?.greeting || "");
      }
    }
  }, [currentPost, contactedWritersQuery.data]);

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
      message: form.getValues().message,
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
    form.setValue("message", message ?? "");
  };

  return (
    <Form {...form}>
      <form>
        <ActiveQueueItem post={currentPost} contact={contactQuery.data} />

        <div className="mt-10 flex flex-col">
          <div className="flex flex-col items-baseline lg:flex-row lg:gap-4">
            <p className="font-bold text-foreground">Message</p>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="link"
                onClick={() => fillWithMessage(user?.Profile?.greeting)}
              >
                Initial
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => fillWithMessage(user?.Profile?.recurring)}
              >
                Recurring
              </Button>
            </div>
          </div>
          <FormField
            name="message"
            render={({ field }) => <Textarea className="mt-2" {...field} />}
          />
        </div>

        <footer className="mt-6 flex flex-col justify-between gap-3 lg:flex-row">
          <div className="flex flex-col gap-3 lg:flex-row">
            <Button variant="secondary" type="button" onClick={removeFromQueue}>
              Remove from queue
            </Button>
            {!contactQuery.data && (
              <Button
                type="button"
                variant="secondary"
                onClick={saveContactHandler}
                className="whitespace-pre-wrap"
              >
                Add {currentPost?.author} to contacts
              </Button>
            )}
          </div>

          <Button
            type="button"
            onClick={sendHandler}
            disabled={redditPost.isPending}
          >
            {redditPost.isPending ? (
              <FontAwesomeIcon icon={faLoader} spin />
            ) : (
              "Send message"
            )}
          </Button>
        </footer>
      </form>
    </Form>
  );
};

const ActiveQueueItem = ({ post, contact }: ActiveQueueItemProps) => {
  const [showNote, setShowNote] = useState(false);

  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-col rounded-xl bg-card p-2">
        <p className="text-xs font-normal uppercase text-card-foreground">
          Subject
        </p>
        <p className="mt-1 font-bold text-card-foreground md:text-xl">
          {post.title}
        </p>
      </div>

      <div className="flex flex-col rounded-xl bg-card p-2">
        <p className="text-xs font-normal uppercase text-card-foreground">
          Author
        </p>
        <div className="mt-1 flex items-center gap-4 break-all font-bold text-card-foreground md:text-xl">
          <p>{post.author}</p>{" "}
          {contact && (
            <button type="button" onClick={() => setShowNote((prev) => !prev)}>
              <Badge>See contact note</Badge>
            </button>
          )}
        </div>

        {showNote && (
          <p className="mt-2 rounded-md border border-border bg-background p-2 text-sm text-card-foreground">
            {contact?.notes}
          </p>
        )}
      </div>
    </header>
  );
};

export default QueueModal;
