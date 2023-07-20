import React, { useEffect } from "react";
import { useUserStore } from "~/stores/useUserStore";

interface Props {
  children: React.ReactNode;
}

const SubscriptionBoundary = ({ children }: Props) => {
  const user = useUserStore();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return children;
};

export default SubscriptionBoundary;
