import { FormattedMessagesList, RedditInboxMessage } from "~/types";

export const formatInboxMessagesToList = (message: RedditInboxMessage) => {
  const messageList: FormattedMessagesList[] = [];

  messageList.push({
    author: message.author,
    body: message.body,
    created: message.created,
    dest: message.dest,
    isReply: false,
  });

  for (let index = 0; index < message.replies.data.children.length; index++) {
    const element = message.replies.data.children[index];

    if (element) {
      messageList.push({
        author: element.data.author,
        body: element.data.body,
        created: element.data.created,
        dest: element.data.dest,
        isReply: !!element.data.parent_id,
      });
    }
  }

  return messageList;
};
