import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { RedditPost, SubmissionFormModule } from "@prisma/client";

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

type Filter =
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
