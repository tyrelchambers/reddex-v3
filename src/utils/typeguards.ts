/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { RedditPost } from "@prisma/client";
import Stripe from "stripe";

export const isStripeCustomer = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): customer is Stripe.Customer => {
  if (typeof customer === "string" || !customer || customer.deleted)
    return false;
  return true;
};

export const isDeletedCustomer = (
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
): customer is Stripe.DeletedCustomer => {
  if (typeof customer === "string" || !customer.deleted) return false;

  return true;
};

export const isRedditPost = (post: any): post is RedditPost => {
  return (
    typeof post === "object" &&
    post !== null &&
    "id" in post &&
    typeof post.id === "string" &&
    "author" in post &&
    typeof post.author === "string" &&
    "flair" in post &&
    (typeof post.flair === "string" || post.flair === null) &&
    "num_comments" in post &&
    typeof post.num_comments === "number" &&
    "post_id" in post &&
    typeof post.post_id === "string" &&
    "flair" in post &&
    typeof post.flair === "string" &&
    "title" in post &&
    typeof post.title === "string" &&
    "ups" in post &&
    typeof post.ups === "number" &&
    "url" in post &&
    typeof post.url === "string" &&
    "subreddit" in post &&
    typeof post.subreddit === "string" &&
    "permission" in post &&
    typeof post.permission === "boolean" &&
    "read" in post &&
    typeof post.read === "boolean" &&
    "reading_time" in post &&
    typeof post.reading_time === "number" &&
    "upvote_ratio" in post &&
    typeof post.upvote_ratio === "number" &&
    "created" in post &&
    typeof post.created === "number" &&
    "content" in post &&
    typeof post.content === "string" &&
    "userId" in post &&
    typeof post.userId === "string" &&
    "deleted_at" in post &&
    (post.deleted_at === null || post.deleted_at instanceof Date)
  );
};
