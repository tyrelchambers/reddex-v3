import Dexie, { Table } from "dexie";
import { PostFromReddit } from "~/types";

export class MySubClassedDexie extends Dexie {
  posts!: Table<PostFromReddit>;

  constructor() {
    super("myDatabase");
    this.version(1).stores({
      posts:
        "++Did, author, created, created_utc, id, link_flair_text, num_comments, selftext, subreddit, title, ups, upvote_ratio, url", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
