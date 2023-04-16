import { RedditStory } from "@prisma/client";
import { create } from "zustand";

interface QueueState {
  queue: RedditStory[];
  add: (item: RedditStory) => void;
  exists: (item: RedditStory) => boolean;
  remove: (item: RedditStory) => void;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  add: (item) =>
    set((state) => {
      if (state.queue.includes(item)) return state;

      return { queue: [...state.queue, item] };
    }),
  exists: (item) => {
    const queue = get().queue;

    return queue.includes(item);
  },
  remove: (item) =>
    set((state) => {
      const queueWithoutItem = state.queue.filter(
        (stateItem) => stateItem !== item
      );

      return {
        queue: queueWithoutItem,
      };
    }),
}));
