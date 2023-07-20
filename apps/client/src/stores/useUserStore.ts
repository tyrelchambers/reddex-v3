import { User } from "@prisma/client";
import Stripe from "stripe";
import { create } from "zustand";

interface Props {
  user: (User & { subscription: Stripe.Subscription | null }) | null;
  setUser: (
    user: (User & { subscription: Stripe.Subscription | null }) | null
  ) => void;
}

export const useUserStore = create<Props>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
