import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes } from "~/routes";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const AuthenticationBoundary = ({ children }: Props) => {
  const router = useRouter();

  const { status } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    router.push(routes.LOGIN);
  }

  if (status !== "loading" && status === "authenticated") {
    return children;
  }

  return null;
};

export default AuthenticationBoundary;
