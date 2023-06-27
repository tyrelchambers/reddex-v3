import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FilterState } from "~/reducers/filterReducer";
import { PostFromReddit } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateReadingTime = (text: string, time: number) => {
  return Math.ceil(text.split(" ").length / time);
};

export const FilterPosts = class FilterClass {
  post: Partial<PostFromReddit> = {};
  filters: Partial<FilterState> = {};

  constructor(post: PostFromReddit | undefined, filters: FilterState) {
    if (post) {
      this.post = post;
    }
    this.filters = filters;
  }

  upvotes() {
    if (!this.post.ups) return null;

    if (
      this.filters.upvotes?.value &&
      this.filters.upvotes.qualifier === "Over"
    ) {
      return this.post.ups >= this.filters.upvotes.value;
    } else if (
      this.filters.upvotes?.value &&
      this.filters.upvotes.qualifier === "Under"
    ) {
      return this.post.ups <= this.filters.upvotes.value;
    } else if (
      this.filters.upvotes?.value &&
      this.filters.upvotes.qualifier === "Equals"
    ) {
      return this.post.ups === this.filters.upvotes.value;
    }
  }

  keywords() {
    if (this.filters.keywords) {
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
        return calculatedTime >= this.filters.readingTime.value;
      } else if (
        this.filters.readingTime?.value &&
        this.filters.readingTime.qualifier === "Under"
      ) {
        return calculatedTime <= this.filters.readingTime.value;
      } else if (
        this.filters.readingTime?.value &&
        this.filters.readingTime.qualifier === "Equals"
      ) {
        return calculatedTime === this.filters.readingTime.value;
      }
    }
  }
};
