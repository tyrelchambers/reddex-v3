import { useRouter } from "next/router";
import { useEffect } from "react";
import { routes } from "~/routes";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(routes.APPROVED);
  }, []);

  return null;
};

export default Index;
