import { Account, RedditPost } from "@prisma/client";
import { format } from "date-fns";
import { FilterState } from "~/reducers/filterReducer";
import { prisma } from "~/server/db";
import { db } from "./dexie";
import { FormattedMessagesList, RedditInboxMessage } from "~/types";
import { getAccessToken } from "./getTokens";

export const addLastSearchedOrUpdate = async () => {
  const exists = await db.lastSearched.get(1);

  if (!exists) {
    await db.lastSearched.add({ time: new Date(Date.now()) });
  }

  await db.lastSearched.update(1, { time: new Date(Date.now()) });
};

export const activeFilters = (filters: FilterState | null) => {
  if (!filters) return [];

  const active = [];

  if (filters?.upvotes?.value && filters?.upvotes?.value > 0) {
    active.push({ label: "upvotes", value: "upvotes" });
  }

  if (filters?.readingTime?.value && filters?.readingTime?.value > 0) {
    active.push({ label: "reading time", value: "readingTime" });
  }

  if (filters?.keywords) {
    active.push({ label: "keywords", value: "keywords" });
  }

  if (filters?.seriesOnly) {
    active.push({ label: "series only", value: "seriesOnly" });
  }

  if (filters?.excludeSeries) {
    active.push({ label: "exclude series", value: "excludeSeries" });
  }

  return active;
};

export const formatCurrency = (
  amount?: number | null,
  currency?: string | null
) => {
  if (!amount || !currency) return null;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount / 100);
};

export const formatInboxMessagesToList = (message: RedditInboxMessage) => {
  const messageList: FormattedMessagesList[] = [];

  messageList.push({
    author: message.author,
    body: message.body,
    created: message.created,
    dest: message.dest,
    isReply: false,
  });

  if (message.replies) {
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
  }

  return messageList;
};

export const formatStripeTime = (time: number) => {
  return format(new Date(time * 1000), "MMMM do, yyyy");
};

export const formatSubject = (title: string) => {
  const MAX_SUBJECT_LENGTH = 100;

  return title.length > MAX_SUBJECT_LENGTH
    ? title.slice(0, MAX_SUBJECT_LENGTH - 3) + "..."
    : title;
};

/**
 * Pass in the approved stories list for use in a native select component
 *
 * @param stories RedditPost[]
 * @returns RedditPost[] | undefined
 */
export const getStorySelectList = (stories: RedditPost[] | undefined) => {
  if (!stories) return;

  const formattedApprovedStories =
    stories.map((s) => ({
      label: s.title,
      value: s.id,
    })) || [];

  const storiesList = [
    { label: "Select a story", value: "" },
    ...formattedApprovedStories,
  ];
  return storiesList;
};
