import { Profile, User } from "@prisma/client";
import { create } from "zustand";
import { StripeSubscription } from "~/types";

interface Props {
  user:
    | (User & {
        subscription: StripeSubscription | null;
        Profile?: Profile | null;
      })
    | null;
  setUser: (
    user:
      | (User & {
          subscription: StripeSubscription | null;
        })
      | null
  ) => void;
}

export const useUserStore = create<Props>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
