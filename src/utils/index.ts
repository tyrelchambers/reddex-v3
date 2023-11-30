import { RedditPost, User } from "@prisma/client";
import { format } from "date-fns";
import { db } from "./dexie";
import {
  Filter,
  FilterState,
  FormattedMessagesList,
  RedditInboxMessage,
  StripeSubscription,
} from "~/types";
import Stripe from "stripe";
import queryString, { ParsedQuery } from "query-string";
import { isDeletedCustomer, isStripeCustomer } from "./typeguards";

export const addLastSearchedOrUpdate = async () => {
  const exists = await db.lastSearched.get(1);

  if (!exists) {
    await db.lastSearched.add({ time: new Date(Date.now()) });
  }

  await db.lastSearched.update(1, { time: new Date(Date.now()) });
};

export const activeFilters = (filters: Partial<FilterState> | null) => {
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
  if (amount === null || amount === undefined || !currency) return null;

  return new Intl.NumberFormat(currency, {
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

export const hasActiveSubscription = (
  subscription: Stripe.Subscription | null
) => {
  if (!subscription) return false;

  if (subscription?.status !== "active" && subscription?.status !== "trialing")
    return false;

  return true;
};

export const isFilterWithQualifier = (value: any): value is Filter => {
  if (typeof value !== "object") return false;

  if (!("qualifier" in value) && !("value" in value)) return false;

  return true;
};

export const buildParams = <T>(appliedFilters: T) => {
  const flattenedFilters = () => {
    const filters: Partial<Record<keyof T, unknown>> = {};

    for (const key in appliedFilters) {
      const element = appliedFilters[key];

      if (
        element &&
        typeof element === "object" &&
        "value" in element &&
        element.value !== undefined &&
        element.value !== 0
      ) {
        filters[key] = Object.values(element);
      } else if (element && typeof element !== "object") {
        filters[key] = element;
      }
    }

    return filters;
  };

  return queryString.stringify(flattenedFilters(), {
    arrayFormat: "comma",
  });
};

export const parseQuery = (query: ParsedQuery) => {
  const parsed: Partial<FilterState> & {
    [key: string]: FilterState[keyof FilterState];
  } = {};

  for (const key in query) {
    const value = query[key] as string;

    if (value?.includes(",")) {
      parsed[key] = {
        qualifier: value.split(",")[0] || null,
        value: Number(value.split(",")[1]) || undefined,
      };
    } else {
      if (value === "true") {
        parsed[key] = true;
      } else if (value === "false") {
        parsed[key] = false;
      } else {
        parsed[key] = value;
      }
    }
  }

  return parsed;
};

export const hasProPlan = (
  subscription: StripeSubscription | undefined | null
) => {
  if (!subscription?.plan) return false;

  const lineItem = subscription.plan.product.name;

  return lineItem === "Pro";
};

export const getCustomerId = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer
) => {
  if (typeof customer === "string") return customer;
  if (isStripeCustomer(customer)) return customer.id;
  if (isDeletedCustomer(customer)) return null;
};

export const getValidSubdomain = (host?: string | null) => {
  let subdomain: string | null = null;
  if (!host && typeof window !== "undefined") {
    // On client side, get the host from window
    host = window.location.host;
  }
  if (host && host.includes(".")) {
    const candidate = host.split(".")[0];
    if (candidate && !candidate.includes("localhost")) {
      // Valid candidate
      subdomain = candidate;
    }
  }
  return subdomain;
};
