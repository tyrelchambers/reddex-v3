import { FilterPosts } from "~/lib/utils";
import { FilterState, PostFromReddit } from "~/types";

export const filterPosts = (
  filters: Partial<FilterState> | null,
  posts: PostFromReddit[],
  profileReadingTime: number | undefined | null,
) => {
  if (!filters) return posts;

  const newArray: PostFromReddit[] = [];

  for (let index = 0; index < posts.length; index++) {
    const element = posts[index];

    if (!element) continue;

    const post = new FilterPosts(element, filters);
    const acceptance: boolean[] = [];

    if (element?.author.includes("[deleted]")) continue;

    const obj: {
      [k in keyof FilterState as string]: () => boolean | undefined | null;
    } = {
      keywords: () => post.keywords(),
      upvotes: () => post.upvotes(),
      readingTime: () => post.readingTime(profileReadingTime ?? 200),
      seriesOnly: () => post.seriesOnly(),
      excludeSeries: () => post.excludeSeries(),
    };

    Object.keys(filters).forEach((key) => {
      const result = obj[key]?.();

      if (result !== undefined && result !== null) {
        acceptance.push(result);
      }
    });

    if (element && acceptance.every((item) => item)) {
      newArray.push(element);
    }
  }

  return newArray;
};
export const paginatedSlice = (
  array: PostFromReddit[],
  page_size: number,
  page_number: number,
) => {
  return array
    .sort((a, b) => b.created_utc - a.created_utc)
    .slice((page_number - 1) * page_size, page_number * page_size);
};
