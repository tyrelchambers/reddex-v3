import {
  faArrowLeft,
  faReply,
  faUserCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import React, { useMemo } from "react";
import {
  FormattedMessagesList,
  MixpanelEvents,
  RedditInboxMessage,
} from "~/types";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { formatInboxMessagesToList } from "~/utils";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "./ui/form";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import MessageContact from "./dashboard/message/MessageContact";
import MessageReadingList from "./dashboard/message/MessageReadingList";
import clsx from "clsx";

const formSchema = z.object({
  message: z.string(),
});

interface Props {
  message: RedditInboxMessage | undefined;
  handleBack?: () => void;
}

export enum ListEnum {
  approvedList,
  completedList,
}

const SelectedInboxMessage = ({ message, handleBack }: Props) => {
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

  const contactquery = api.contact.getByName.useQuery(message?.dest);
  const approvedListQuery = api.story.getApprovedList.useQuery();
  const completedListQuery = api.story.getCompletedList.useQuery();
  const stories = api.story.addToApproved.useMutation({
    onSuccess: (data) => {
      if ("success" in data && !data.success) {
        apiContext.story.getApprovedList.invalidate();
        return toast(data.message, { type: "info" });
      }
    },
  });

  const post = findPostQuery.data;

  const postIsInReadingList = useMemo(() => {
    if (post?.id && approvedListQuery.data) {
      const approvedList = approvedListQuery.data.some((item) => {
        return item.id === post.id;
      });

      const completedList = completedListQuery.data?.some((item) => {
        return item.id === post.id && item.read;
      });

      if (approvedList) {
        return ListEnum.approvedList;
      } else if (completedList) {
        return ListEnum.completedList;
      }
    }

    return -1;
  }, [post?.id, approvedListQuery.data]);

  const isAContact = !!contactquery.data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  if (!message) return null;

  const formattedMessages = formatInboxMessagesToList(message);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SEND_INBOX_MESSAGE);

    messageMutation.mutate(
      {
        thing_id: message.name,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Message sent!");
          apiContext.inbox.invalidate();
          form.reset();
        },
      },
    );
  };

  const addToContacts = (name: string) => {
    trackUiEvent(MixpanelEvents.ADD_INBOX_CONTACT_TO_CONTACTS);
    addContact.mutate({ name });
  };

  const addStoryToReadingList = () => {
    if (post) {
      trackUiEvent(MixpanelEvents.ADD_STORY_TO_READING_LIST);
      stories.mutate(post.id);
      toast.success("Added to reading list");
    }
  };

  return (
    <div
      className={clsx(
        "w-full max-w-screen-xl flex-1 overflow-auto p-4 xl:m-5 xl:my-6 xl:p-5",
      )}
    >
      <button
        onClick={handleBack}
        className={clsx("mb-8 xl:hidden", message && "flex items-center")}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-4 text-foreground" />
        Back to Inbox
      </button>

      <header className="w-full">
        <p className="text-xl font-semibold text-foreground lg:text-3xl">
          {message.subject}
        </p>
        <footer className="mt-6 flex w-full flex-col gap-2 sm:w-fit sm:flex-row xl:items-center">
          <a
            href={`https://reddit.com/u/${message.dest}`}
            className="mr-3 flex w-full items-center gap-2 rounded-full bg-card px-3 py-1 text-sm text-foreground"
            target="_blank"
          >
            <FontAwesomeIcon icon={faUserCircle} />
            <span className="text-muted-foreground">{message.dest}</span>
          </a>

          <div className="flex items-center gap-2 lg:flex-row">
            <MessageContact
              addContactHandler={addToContacts}
              isContact={isAContact}
              message={message}
            />

            {post && (
              <MessageReadingList
                addStoryToReadingList={addStoryToReadingList}
                postIsInReadingList={postIsInReadingList}
                message={message}
              />
            )}
          </div>
        </footer>
      </header>

      <Separator className="my-10" />

      <section className="my-10 flex flex-col gap-10">
        {formattedMessages.map((msg) => (
          <InboxMessageReply message={msg} key={msg.created} />
        ))}
      </section>

      <Separator className="mb-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)}>
          <FormField
            name="message"
            render={({ field }) => (
              <FormItem>
                <Textarea placeholder="Send a reply..." {...field} />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3">
            Send message
          </Button>
        </form>
      </Form>
    </div>
  );
};

const InboxMessageReply = ({ message }: { message: FormattedMessagesList }) => {
  return (
    <div className="rounded-2xl bg-card p-4">
      <header className="mb-6 flex flex-col items-baseline justify-between sm:flex-row xl:mb-2">
        <p className="mb-2 font-bold text-card-foreground">
          {message.isReply && (
            <FontAwesomeIcon icon={faReply} className="mr-4 text-accent" />
          )}
          {message.author}
        </p>
        <p className="text-card-foreground/50">
          {format(fromUnixTime(message.created), "MMM do, yyyy")}
        </p>
      </header>
      <p className="w-full hyphens-auto whitespace-pre-wrap break-all text-muted-foreground lg:break-normal">
        {message.body}
      </p>
    </div>
  );
};

export default SelectedInboxMessage;
