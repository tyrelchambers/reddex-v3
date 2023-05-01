import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { routes } from "~/routes";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.STORIES);
  }, []);

  return null;
};

export default Index;
