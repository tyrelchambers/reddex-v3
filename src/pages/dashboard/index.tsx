import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { routes } from "~/routes";

const Index = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      router.push(routes.HOME);
    } else if (status !== "loading" && status === "authenticated") {
      router.push(routes.OVERVIEW);
    }
  }, [status, router.isReady]);

  return null;
};

export default Index;
