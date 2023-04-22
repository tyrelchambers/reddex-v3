import { RedditPost } from "@prisma/client";

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
