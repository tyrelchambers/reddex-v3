import { Profile, User } from "@prisma/client";
import { create } from "zustand";
import { StripeSubscription } from "~/types";

interface Props {
  user:
    | (User & {
        hasActiveSubscription: boolean;
        subscription: StripeSubscription | null;
        Profile?: Profile | null;
      })
    | null;
  setUser: (
    user:
      | (User & {
          subscription: StripeSubscription | null;
          hasActiveSubscription: boolean;
        })
      | null
  ) => void;
}

export const useUserStore = create<Props>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
