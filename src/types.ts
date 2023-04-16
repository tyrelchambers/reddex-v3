import { RedditPost } from "@prisma/client";

export interface RedditPostWithText extends RedditPost {
  selftext: string;
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

// id            String          @id @default(cuid())
//     author        String
//     flair         String
//     num_comments  Int
//     post_id       String
//     story_length  Int
//     title         String
//     ups           Int
//     url           String
//     subreddit     String
//     permission    Boolean         @default(false)
//     read          Boolean         @default(false)
//     reading_time  Int
//     upvote_ratio  Float
//     created       Int
//     user          User            @relation(fields: [userId], references: [id])
//     userId        String
//     TagsOnStories TagsOnStories[]
