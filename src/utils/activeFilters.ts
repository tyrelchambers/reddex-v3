import { type FilterState } from "~/reducers/filterReducer";

export const activeFilters = (filters: FilterState) => {
  const active = [];

  if (filters.upvotes.value && filters.upvotes.value > 0) {
    active.push("Upvotes");
  }

  if (filters.readingTime.value && filters.readingTime.value > 0) {
    active.push("Reading time");
  }

  if (filters.keywords) {
    active.push("Keywords");
  }

  if (filters.seriesOnly) {
    active.push("Series only");
  }

  if (filters.excludeSeries) {
    active.push("Exclude series");
  }

  return active;
};
