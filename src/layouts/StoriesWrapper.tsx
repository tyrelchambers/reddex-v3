import { useRouter } from "next/router";
import React from "react";
import TabsList from "~/components/TabsList";
import { storiesTabs } from "~/routes";
import Header from "./Header";
import DashNav from "./DashNav";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
}

const StoriesWrapper = ({ children }: Props) => {
  const pathname = useRouter().pathname;

  console.log(pathname);

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex w-full max-w-screen-2xl gap-14">
        <header>
          <TabsList tabs={storiesTabs} route={pathname} />
        </header>
        {children}
      </main>
    </>
  );
};

export default StoriesWrapper;
