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
import {
  FormattedMessagesList,
  MixpanelEvents,
  RedditInboxMessage,
} from "~/types";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { mantineInputClasses } from "~/lib/styles";
import { formatInboxMessagesToList } from "~/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";

interface Props {
  message: RedditInboxMessage | undefined;
}

const SelectedInboxMessage = ({ message }: Props) => {
  const apiContext = api.useUtils();
  const messageMutation = api.inbox.send.useMutation();
  const addContact = api.contact.save.useMutation({
    onSuccess: () => {
      apiContext.contact.invalidate();
      toast.success("Contact added!");
    },
  });
  const findPostQuery = api.inbox.findPostByTitle.useQuery(message?.subject, {
    enabled: !!message?.subject,
  });

  console.log(message);

  const contactquery = api.contact.getByName.useQuery(message?.dest);
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

  console.log(isAContact);

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  if (!message) return null;

  const formattedMessages = formatInboxMessagesToList(message);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    trackUiEvent(MixpanelEvents.SEND_INBOX_MESSAGE);

    messageMutation.mutate({
      thing_id: message.name,
      message: form.values.message,
    });
  };

  const addToContacts = (name: string) => {
    trackUiEvent(MixpanelEvents.ADD_INBOX_CONTACT_TO_CONTACTS);
    addContact.mutate({ name });
  };

  const addStoryToReadingList = () => {
    if (post) {
      trackUiEvent(MixpanelEvents.ADD_STORY_TO_READING_LIST);
      stories.mutate(post.id);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="w-full">
        <p className="text-2xl font-semibold text-foreground">
          {message.subject}
        </p>
        <footer className="mt-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-10">
          <p className="flex items-center gap-2 text-foreground/70">
            <FontAwesomeIcon icon={faUserCircle} />
            {message.dest}
          </p>

          <div className=" flex flex-col gap-4 lg:flex-row">
            {!isAContact ? (
              <Button
                variant="secondary"
                onClick={() => addToContacts(message.dest)}
              >
                Add to contacts
              </Button>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-[1px] border-border px-3 py-2 text-sm text-foreground/60">
                {message.dest} is already a contact
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
        className="sticky bottom-4 flex items-end gap-3 rounded-xl border-[1px] border-border bg-card p-2 shadow-lg"
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
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white hover:bg-primary hover:text-foreground"
          type="submit"
        >
          <FontAwesomeIcon
            icon={faPaperPlaneTop}
            className="text-sm  shadow-sm"
          />
        </button>
      </form>
    </div>
  );
};

const InboxMessageReply = ({ message }: { message: FormattedMessagesList }) => {
  return (
    <div className="rounded-2xl bg-card/50 p-4">
      <header className="mb-6 flex flex-col items-baseline justify-between xl:mb-2 xl:flex-row">
        <p className="mb-2  font-bold text-card-foreground">
          {message.isReply && (
            <FontAwesomeIcon icon={faReply} className="mr-4 text-accent" />
          )}
          {message.author}
        </p>
        <p className=" text-card-foreground/50">
          {format(fromUnixTime(message.created), "MMM do, yyyy")}
        </p>
      </header>
      <p className="whitespace-pre-wrap break-all text-muted-foreground">
        {message.body}
      </p>
    </div>
  );
};

export default SelectedInboxMessage;
