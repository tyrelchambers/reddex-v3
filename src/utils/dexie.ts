import Dexie, { DexieOptions, Table } from "dexie";
import { PostFromReddit } from "~/types";

export class DexieInstance extends Dexie {
  posts!: Table<PostFromReddit>;
  lastSearched!: Table<{ time: Date }>;
  constructor(database?: string, options?: DexieOptions | undefined) {
    super(database || "Reddex", options);
    this.version(1).stores({
      posts:
        "++Did, author, created, created_utc, id, link_flair_text, num_comments, selftext, subreddit, title, ups, upvote_ratio, url", // Primary key and indexed props
      lastSearched: "++Did, time",
    });
  }
}

export const db = new DexieInstance();
