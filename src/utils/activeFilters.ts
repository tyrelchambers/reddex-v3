import { type FilterState } from "~/reducers/filterReducer";

export const activeFilters = (filters: FilterState | null) => {
  if (!filters) return [];

  const active = [];

  if (filters?.upvotes?.value && filters?.upvotes?.value > 0) {
    active.push({ label: "upvotes", value: "upvotes" });
  }

  if (filters?.readingTime?.value && filters?.readingTime?.value > 0) {
    active.push({ label: "reading time", value: "readingTime" });
  }

  if (filters?.keywords) {
    active.push({ label: "keywords", value: "keywords" });
  }

  if (filters?.seriesOnly) {
    active.push({ label: "series only", value: "seriesOnly" });
  }

  if (filters?.excludeSeries) {
    active.push({ label: "exclude series", value: "excludeSeries" });
  }

  return active;
};
