import { type FilterState } from "~/reducers/filterReducer";

export const activeFilters = (filters: FilterState | null) => {
  if (!filters) return [];

  const active = [];

  if (filters?.upvotes?.value && filters?.upvotes?.value > 0) {
    active.push("upvotes");
  }

  if (filters?.readingTime?.value && filters?.readingTime?.value > 0) {
    active.push("reading time");
  }

  if (filters?.keywords) {
    active.push("keywords");
  }

  if (filters?.seriesOnly) {
    active.push("series only");
  }

  if (filters?.excludeSeries) {
    active.push("exclude series");
  }

  return active;
};
