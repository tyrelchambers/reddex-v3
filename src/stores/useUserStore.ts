import { Profile, RecentlySearched, User } from "@prisma/client";
import { create } from "zustand";
import { StripeSubscription } from "~/types";

type Data =
  | (User & {
      Profile?: (Profile & { searches: RecentlySearched[] | null }) | null;
    }) & {
      hasActiveSubscription: boolean;
      subscription: StripeSubscription | null;
    };
interface Props {
  user: Data | undefined;
  setUser: (user: Data | undefined) => void;
}

export const useUserStore = create<Props>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
