import {
  faPaperPlaneTop,
  faReply,
  faUserCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Textarea } from "@mantine/core";
import { fromUnixTime } from "date-fns";
import { format } from "date-fns";
import React, { FormEvent } from "react";
import { FormattedMessagesList, RedditInboxMessage } from "~/types";
import { formatInboxMessagesToList } from "~/utils/formatInboxMessagesToList";
import { api } from "~/utils/api";
import { useForm } from "@mantine/form";
import { sendToast } from "~/utils/sendToast";
import { toast } from "react-toastify";

interface Props {
  message: RedditInboxMessage | undefined;
}

const SelectedInboxMessage = ({ message }: Props) => {
  const messageMutation = api.inbox.send.useMutation();
  const addContact = api.contact.save.useMutation();
  const stories = api.post.addToApproved.useMutation({
    onSuccess: (data) => {
      if (!data?.success && data?.message) {
        return sendToast({ message: data.message });
      }
    },
  });

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
    stories.mutate(message.id);
  };

  return (
    <div className="flex-1 overflow-auto">
      <header className="w-full">
        <p className="text-2xl font-bold text-gray-700">{message.subject}</p>
        <footer className="mt-6 flex items-center gap-10 ">
          <p className="flex items-center gap-2 text-gray-500">
            <FontAwesomeIcon icon={faUserCircle} />
            {message.dest}
          </p>

          <div className=" flex gap-4">
            <button
              type="button"
              className="button alt"
              onClick={() => addToContacts(message.dest)}
            >
              Add to contacts
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={addStoryToReadingList}
            >
              Add to reading list
            </button>
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
        className="sticky bottom-4 flex items-end gap-3 rounded-xl bg-indigo-500 p-2 shadow-lg"
        onSubmit={submitHandler}
      >
        <Textarea
          placeholder="Send a reply..."
          classNames={{
            input:
              "border-indigo-400 bg-transparent border-1[px] text-white placeholder:text-white rounded-lg",
          }}
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
            className="text-sm text-indigo-500 shadow-sm"
          />
        </button>
      </form>
    </div>
  );
};

const InboxMessageReply = ({ message }: { message: FormattedMessagesList }) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <header className="mb-2 flex items-baseline justify-between">
        <p className="mb-2 text-xl font-bold text-gray-700">
          {message.isReply && (
            <FontAwesomeIcon icon={faReply} className="mr-4 text-indigo-500" />
          )}
          {message.author}
        </p>
        <p className=" font-thin text-gray-800">
          {format(fromUnixTime(message.created), "MMM do, yyyy")}
        </p>
      </header>
      <p className="whitespace-pre-wrap font-thin text-gray-700">
        {message.body}
      </p>
    </div>
  );
};

export default SelectedInboxMessage;
