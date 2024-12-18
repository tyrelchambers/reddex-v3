import { create } from "zustand";
import { FilterState } from "~/types";

interface SearchStore {
  search: string;
  setSearch: (search: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  filters: Partial<FilterState>;
  setFilters: (filters: Partial<FilterState>) => void;
  recentSearches: { text: string; id: string; profileId: string | null }[];
  setPage: (page: number) => void;
  page: number;
  loadingPosts: boolean;
  setLoadingPosts: (loadingPosts: boolean) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  search: "",
  setSearch: (search) => set(() => ({ search })),
  clearSearch: () => set(() => ({ search: "" })),
  isSearching: false,
  setIsSearching: (isSearching) => set(() => ({ isSearching })),
  filters: {},
  setFilters: (filters) => set(() => ({ filters })),
  recentSearches: [],
  setPage: (page) => set(() => ({ page })),
  page: 1,
  loadingPosts: false,
  setLoadingPosts: (loadingPosts) => set(() => ({ loadingPosts })),
}));
