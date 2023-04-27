import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes } from "~/routes";

const Website = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.push(routes.WEBSITE_GENERAL);
    }
  }, [router.isReady]);

  return <></>;
};

export default Website;
