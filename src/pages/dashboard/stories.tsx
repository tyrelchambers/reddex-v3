import { useRouter } from "next/router";
import { useEffect } from "react";
import { routes } from "~/routes";

const Stories = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.APPROVED);
  }, [router.isReady]);

  return null;
};

export default Stories;
