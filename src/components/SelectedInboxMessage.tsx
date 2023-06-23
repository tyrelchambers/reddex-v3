import {
  faPaperPlaneTop,
  faReply,
  faUserCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Textarea } from "@mantine/core";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import React, { FormEvent, useMemo } from "react";
import { FormattedMessagesList, RedditInboxMessage } from "~/types";
import { formatInboxMessagesToList } from "~/utils/formatInboxMessagesToList";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { mantineInputClasses } from "~/lib/styles";

interface Props {
  message: RedditInboxMessage | undefined;
}

const SelectedInboxMessage = ({ message }: Props) => {
  const messageMutation = api.inbox.send.useMutation();
  const addContact = api.contact.save.useMutation();
  const findPostQuery = api.inbox.findPostByTitle.useQuery(message?.subject, {
    enabled: !!message?.subject,
  });
  const contactquery = api.contact.getByName.useQuery(message?.author);
  const approvedListQuery = api.story.getApprovedList.useQuery();
  const stories = api.story.addToApproved.useMutation({
    onSuccess: (data) => {
      if ("success" in data && !data.success) {
        return toast(data.message, { type: "info" });
      }
    },
  });

  const post = findPostQuery.data;

  const postIsInReadingList = useMemo(() => {
    if (post?.id && approvedListQuery.data) {
      return approvedListQuery.data.some((item) => {
        return item.id === post.id;
      });
    }

    return false;
  }, [post?.id, approvedListQuery.data]);

  const isAContact = contactquery.data;

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  if (!message) return null;

  const formattedMessages = formatInboxMessagesToList(message);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    messageMutation.mutate({
      thing_id: message.name,
      message: form.values.message,
    });
  };

  const addToContacts = (name: string) => {
    addContact.mutate({ name });
  };

  const addStoryToReadingList = () => {
    if (post) {
      stories.mutate(post.id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="w-full">
        <p className="text-2xl font-semibold text-foreground">
          {message.subject}
        </p>
        <footer className="mt-6 flex items-center gap-10 ">
          <p className="flex items-center gap-2 text-foreground">
            <FontAwesomeIcon icon={faUserCircle} />
            {message.dest}
          </p>

          <div className=" flex gap-4">
            {!isAContact ? (
              <Button
                variant="secondary"
                onClick={() => addToContacts(message.dest)}
              >
                Add to contacts
              </Button>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-[1px] border-border px-3 py-2 text-sm text-foreground/60">
                {message.author} is already a contact
              </div>
            )}

            {post && (
              <>
                {!postIsInReadingList ? (
                  <Button variant="secondary" onClick={addStoryToReadingList}>
                    Add to reading list
                  </Button>
                ) : (
                  <div className="flex items-center justify-center rounded-lg border-[1px] border-border px-3 py-2 text-sm text-foreground/60">
                    Story is in reading list
                  </div>
                )}
              </>
            )}
          </div>
        </footer>
      </header>

      <Divider className="my-10" />

      <section className="my-10 flex flex-col gap-10">
        {formattedMessages.map((msg) => (
          <InboxMessageReply message={msg} key={msg.created} />
        ))}
      </section>

      <form
        className="sticky bottom-4 flex items-end gap-3 rounded-xl border-[1px] border-border bg-muted p-2 shadow-lg"
        onSubmit={submitHandler}
      >
        <Textarea
          variant="filled"
          placeholder="Send a reply..."
          classNames={mantineInputClasses}
          className="min-h-10 flex-1"
          autosize
          maxRows={6}
          {...form.getInputProps("message")}
        />
        <button
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white"
          type="submit"
        >
          <FontAwesomeIcon
            icon={faPaperPlaneTop}
            className="text-sm text-rose-500 shadow-sm"
          />
        </button>
      </form>
    </div>
  );
};

const InboxMessageReply = ({ message }: { message: FormattedMessagesList }) => {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <header className="mb-2 flex items-baseline justify-between">
        <p className="mb-2  font-bold text-foreground">
          {message.isReply && (
            <FontAwesomeIcon icon={faReply} className="mr-4 text-accent" />
          )}
          {message.author}
        </p>
        <p className="font-thin italic text-foreground">
          {format(fromUnixTime(message.created), "MMM do, yyyy")}
        </p>
      </header>
      <p className="whitespace-pre-wrap font-thin text-foreground">
        {message.body}
      </p>
    </div>
  );
};

export default SelectedInboxMessage;
