import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes } from "~/routes";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const AuthenticationBoundary = ({ children }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push(routes.LOGIN);
    }
    if (status !== "loading" && status === "authenticated") {
      setLoading(false);
    }
  }, [status]);

  return loading ? null : children;
};

export default AuthenticationBoundary;
