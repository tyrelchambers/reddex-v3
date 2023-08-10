import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  Account,
  Prisma,
  RedditPost,
  SubmissionFormModule,
} from "@prisma/client";
import Stripe from "stripe";
export interface RedditPostWithText extends RedditPost {
  selftext: string;
}

export interface Tab {
  label: string;
  slug: string;
}

export interface PostFromReddit {
  author: string;
  created: number;
  created_utc: number;
  id: string;
  link_flair_text: string;
  num_comments: number;
  selftext: string;
  subreddit: string;
  title: string;
  ups: number;
  upvote_ratio: number;
  url: string;
}

export interface ReturnAccessToken {
  access_token: string;
  token_type: string;
  expires_at: number;
  refresh_token: string;
  scope: string;
}

export interface RedditInboxMessage {
  first_message: string | null;
  first_message_name: string | null;
  subreddit: string | null;
  likes: number | null;
  replies: RedditInboxResponse;
  author_fullname: string;
  id: string;
  subject: string;
  associated_awarding_id: string | null;
  score: number;
  author: string;
  num_comments: number | null;
  parent_id: string | null;
  subreddit_name_prefixed: string | null;
  new: boolean;
  type: string;
  body: string;
  dest: string;
  was_comment: boolean;
  body_html: string;
  name: string;
  created: number;
  created_utc: number;
  context: string;
  distinguished: null;
}

export interface RedditInboxChildren {
  kind: string;
  data: RedditInboxMessage;
}
export interface RedditInboxResponse {
  data: {
    after: string;
    dist: string | null;
    modhash: string;
    geo_filter: string;
    children: RedditInboxChildren[];
  };
}

export interface FormattedMessagesList {
  author: string;
  body: string;
  created: number;
  dest: string;
  isReply: boolean;
}

export interface Tab {
  label: string;
  slug: string;
  icon: IconProp;
}

export interface GeneralSettings {
  subdomain: string | null | undefined;
  name: string | null | undefined;
  description: string | null | undefined;
  twitter: string | null | undefined;
  facebook: string | null | undefined;
  instagram: string | null | undefined;
  patreon: string | null | undefined;
  podcast: string | null | undefined;
  youtube: string | null | undefined;
}

export type SubmissionFormModuleWithoutId = Omit<
  SubmissionFormModule,
  "id" | "submissionPageId"
>;

export interface SelectValue {
  label: string;
  value: string;
}

export type GenerateTypes = "title" | "description" | "tags";

export interface FilterState {
  upvotes: Filter;
  readingTime: Filter;
  keywords: string | undefined;
  seriesOnly: boolean;
  excludeSeries: boolean;
}

export type FilterQualifier = "Over" | "Under" | "Equals";

export type Filter =
  | {
      qualifier: string | FilterQualifier;
      value: number;
    }
  | {
      qualifier?: string | FilterQualifier;
      value: number;
    }
  | { qualifier: string | FilterQualifier | null; value?: number };

export type FilterAction =
  | {
      type: "UPDATE_FILTER";
      payload: Filter;
      filter: "upvotes" | "readingTime";
    }
  | {
      type: "KEYWORDS";
      payload: string;
    }
  | {
      type: "SERIES_ONLY";
      payload: boolean;
    }
  | {
      type: "EXCLUDE_SERIES";
      payload: boolean;
    }
  | {
      type: "REMOVE_FILTER";
      payload: string;
    }
  | {
      type: "RESET";
    };

export type StripeSubscription = Stripe.Subscription & {
  plan?: Stripe.Plan & {
    product?: Stripe.Product;
  };
};

export type FindUserResponse = Prisma.UserArgs["include"] extends {
  accounts: true;
}
  ? { accounts: Account }
  : object;

export enum MixpanelEvents {
  "SUBREDDIT_SEARCH" = "SUBREDDIT_SEARCH",
  "ADD_TO_QUEUE" = "ADD_TO_QUEUE",
  "REMOVE_FROM_QUEUE" = "REMOVE_FROM_QUEUE",
  "TOGGLE_THEME" = "TOGGLE_THEME",
  "GET_STARTED" = "GET_STARTED",
  "OPEN_SEARCH_DRAWER" = "OPEN_SEARCH_DRAWER",
  "OPEN_USER_MENU" = "OPEN_USER_MENU",
  "LOGOUT" = "LOGOUT",
  "IMPORT_STORY" = "IMPORT_STORY",
  "OPEN_TAG_MODAL" = "OPEN_TAG_MODAL",
  "MARK_AS_READ" = "MARK_AS_READ",
  "VIEW_IN_STUDIO" = "VIEW_IN_STUDIO",
  "ADD_TAG_TO_STORY" = "ADD_TAG_TO_STORY",
  "DELETE_STORY" = "DELETE_STORY",
  "ADD_TO_APPROVED" = "ADD_TO_APPROVED",
  "REMOVE_ALL_COMPLETED_STORIES" = "REMOVE_ALL_COMPLETED_STORIES",
  "VIEW_SUBMITTED_STORY" = "VIEW_SUBMITTED_STORY",
  "COPY_GENERATED_TITLE" = "COPY_GENERATED_TITLE",
  "GENERATE_STUDIO_TITLE" = "GENERATE_STUDIO_TITLE",
  "COPY_GENERATED_DESCRIPTION" = "COPY_GENERATED_DESCRIPTION",
  "GENERATE_STUDIO_DESCRIPTION" = "GENERATE_STUDIO_DESCRIPTION",
  "COPY_GENERATED_TAGS" = "COPY_GENERATED_TAGS",
  "GENERATE_STUDIO_TAGS" = "GENERATE_STUDIO_TAGS",
  "HIDE_WEBSITE" = "HIDE_WEBSITE",
  "SHOW_WEBSITE" = "SHOW_WEBSITE",
  "SAVE_WEBSITE_SETTINGS" = "SAVE_WEBSITE_SETTINGS",
  "PROCESS_THUMBNAIL" = "PROCESS_THUMBNAIL",
  "PROCESS_BANNER" = "PROCESS_BANNER",
  "SAVE_INTERGRATIONS_SETTINGS" = "SAVE_INTERGRATIONS_SETTINGS",
  "HIDE_SUBMISSION_FORM" = "HIDE_SUBMISSION_FORM",
  "SAVE_SUBMISSION_FORM" = "SAVE_SUBMISSION_FORM",
  "SAVE_THEME_SETTINGS" = "SAVE_THEME_SETTINGS",
  "SAVE_CONTACT_FORM" = "SAVE_CONTACT_FORM",
  "OPEN_ADD_CONTACT_MODAL" = "OPEN_ADD_CONTACT_MODAL",
  "OPEN_EDIT_CONTACT_MODAL" = "OPEN_EDIT_CONTACT_MODAL",
  "SAVE_EDIT_CONTACT_FORM" = "SAVE_EDIT_CONTACT_FORM",
  "DELETE_CONTACT" = "DELETE_CONTACT",
  "RESET_SEARCH_INPUT" = "RESET_SEARCH_INPUT",
  "SEARCH_INBOX" = "SEARCH_INBOX",
  "SELECT_INBOX_MESSAGE" = "SELECT_INBOX_MESSAGE",
  "SEND_INBOX_MESSAGE" = "SEND_INBOX_MESSAGE",
  "ADD_INBOX_CONTACT_TO_CONTACTS" = "ADD_INBOX_CONTACT_TO_CONTACTS",
  "ADD_STORY_TO_READING_LIST" = "ADD_STORY_TO_READING_LIST",
  "CREATE_TAG" = "CREATE_TAG",
  "CREATE_SUBSCRIPTION_FAILED" = "CREATE_SUBSCRIPTION_FAILED",
  "ONBOARDING" = "ONBOARDING",
}
