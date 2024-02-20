import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterState, PostFromReddit } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateReadingTime = (text: string, time: number) => {
  return Math.ceil(text.split(" ").length / time);
};

export const FilterPosts = class FilterClass {
  post: PostFromReddit;
  filters: Partial<FilterState> = {};

  constructor(post: PostFromReddit, filters: Partial<FilterState>) {
    this.post = post;

    this.filters = filters;
  }

  upvotes() {
    if (this.filters.upvotes) {
      if (
        this.filters.upvotes?.value &&
        this.filters.upvotes.qualifier === "Over"
      ) {
        return this.post.ups >= Number(this.filters.upvotes.value);
      } else if (
        this.filters.upvotes?.value &&
        this.filters.upvotes.qualifier === "Under"
      ) {
        return this.post.ups <= Number(this.filters.upvotes.value);
      } else if (
        this.filters.upvotes?.value &&
        this.filters.upvotes.qualifier === "Equals"
      ) {
        return this.post.ups === Number(this.filters.upvotes.value);
      }
    }
  }

  keywords() {
    if (this.filters.keywords) {
      console.log(this.filters.keywords);

      const splitWords = this.filters.keywords.split(",");

      if (splitWords.length === 1)
        return (
          this.post.title
            ?.toLowerCase()
            ?.includes(this.filters.keywords.toLowerCase()) ||
          this.post.selftext
            ?.toLowerCase()
            ?.includes(this.filters.keywords.toLowerCase()) ||
          this.post.author
            ?.toLowerCase()
            ?.includes(this.filters.keywords.toLowerCase())
        );

      if (splitWords.length > 1)
        return splitWords.every(
          (word) =>
            this.post.title?.toLowerCase()?.includes(word.toLowerCase()) ||
            this.post.selftext?.toLowerCase()?.includes(word.toLowerCase()) ||
            this.post.author?.toLowerCase()?.includes(word.toLowerCase())
        );
    }
  }

  readingTime(time: number) {
    if (!this.post.selftext) return false;

    const calculatedTime = calculateReadingTime(this.post.selftext, time);

    if (this.filters.readingTime) {
      if (
        this.filters.readingTime?.value &&
        this.filters.readingTime.qualifier === "Over"
      ) {
        return calculatedTime >= Number(this.filters.readingTime.value);
      } else if (
        this.filters.readingTime?.value &&
        this.filters.readingTime.qualifier === "Under"
      ) {
        return calculatedTime <= Number(this.filters.readingTime.value);
      } else if (
        this.filters.readingTime?.value &&
        this.filters.readingTime.qualifier === "Equals"
      ) {
        return calculatedTime === Number(this.filters.readingTime.value);
      }
    }
  }

  seriesOnly() {
    if (!this.post.link_flair_text) return false;

    if (this.filters.seriesOnly) {
      return this.post.link_flair_text === "Series";
    }
  }

  excludeSeries() {
    if (!this.post.link_flair_text) return false;

    if (this.filters.excludeSeries) {
      return this.post.link_flair_text !== "Series";
    }
  }
};
