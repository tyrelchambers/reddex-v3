import { create } from "zustand";
import { PostFromReddit } from "~/types";

interface QueueState {
  queue: PostFromReddit[];
  add: (item: PostFromReddit) => void;
  exists: (item: PostFromReddit) => boolean;
  remove: (item: PostFromReddit) => void;
  clear: () => void;
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
  clear: () => set(() => ({ queue: [] })),
}));
