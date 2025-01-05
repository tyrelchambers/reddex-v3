import { InboxMessage } from "@prisma/client";
import { z } from "zod";

export const searchSchema = z.object({
  subreddit: z.string(),
  category: z.string(),
});

export const submitSchema = z.object({
  email: z.string().optional(),
  author: z.string().optional(),
  title: z.string().optional(),
  story: z.string(),
  siteId: z.string(),
  sent_to_others: z.boolean().optional(),
});

export const postSchema = z.object({
  author: z.string(),
  flair: z.string().nullable(),
  num_comments: z.number(),
  post_id: z.string(),
  story_length: z.number(),
  title: z.string(),
  ups: z.number(),
  url: z.string(),
  subreddit: z.string(),
  permission: z.boolean().optional(),
  read: z.boolean().optional(),
  reading_time: z.number(),
  upvote_ratio: z.number(),
  created: z.number(),
  message: z.string(),
  content: z.string(),
});

export const contactSchema = z.object({
  name: z.string(),
  notes: z.string().optional(),
});

export const editContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
});

export const tagOnPostSchema = z.object({
  redditPostId: z.string(),
  tagId: z.string(),
});
export const tagSaveSchema = z.object({
  tag: z.string(),
  storyId: z.string().optional(),
});

export const sendMessageSchema = z.object({
  message: z.string(),
  thing_id: z.string(),
});

export const websiteThemeSchema = z.object({
  theme: z.string().optional(),
  colour: z.string().optional(),
});

export const websiteGeneralSchema = z.object({
  subdomain: z.union([z.string(), z.undefined()]).nullable(),
  name: z.union([z.string(), z.undefined()]).nullable(),
  description: z.union([z.string(), z.undefined()]).nullable(),
  twitter: z.union([z.string(), z.undefined()]).nullable(),
  facebook: z.union([z.string(), z.undefined()]).nullable(),
  instagram: z.union([z.string(), z.undefined()]).nullable(),
  patreon: z.union([z.string(), z.undefined()]).nullable(),
  podcast: z.union([z.string(), z.undefined()]).nullable(),
  youtube: z.union([z.string(), z.undefined()]).nullable(),
  tiktok: z.union([z.string(), z.undefined()]).nullable(),
  ohcleo: z.union([z.string(), z.undefined()]).nullable(),
  banner: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
});

export const websiteIntegrationsSchema = z.object({
  youtubeIntegrationId: z.string().optional(),
});

export const websiteSubmissionSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  submissionFormModules: z.object({
    title: z.object({
      id: z.string().optional(),
      enabled: z.boolean(),
      required: z.boolean(),
    }),
    author: z.object({
      id: z.string().optional(),
      enabled: z.boolean(),
      required: z.boolean(),
    }),
    email: z.object({
      id: z.string().optional(),
      enabled: z.boolean(),
      required: z.boolean(),
    }),
  }),
});

export const removeImageSchema = z.object({
  type: z.string(),
  url: z.string(),
});

export const saveProfileSchema = z.object({
  words_per_minute: z.string().optional(),
  email: z.string().optional(),
  greeting: z.string().optional(),
  recurring: z.string().optional(),
});

export const updateBillingSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
});

export const createSubscriptionSchema = z.object({
  customerId: z.string(),
  plan: z.string(),
});

export const createCheckoutSchema = z.object({
  price: z.string(),
  email: z.string().optional().nullable(),
});

export const subscriptionSchema = z.object({
  customerId: z.string(),
  subscriptionId: z.string().optional(),
  plan: z.string().optional(),
});

export const sendInboxMessage = z.ZodType<InboxMessage>;

export const shopSchema = z.object({
  id: z.string().optional(),
  token: z.string().nullable(),
  verifiedConnection: z.boolean().nullable(),
  enabled: z.boolean(),
  websiteId: z.string(),
  type: z.string().nullable(),
});
