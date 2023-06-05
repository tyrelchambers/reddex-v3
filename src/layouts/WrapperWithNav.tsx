import React from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs: Tab[];
}

const WrapperWithNav = ({ children, tabs }: Props) => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex w-full max-w-screen-2xl gap-14">
        <header className="w-48">
          <TabsList tabs={tabs} />
        </header>
        {children}
      </main>
    </>
  );
};

export default WrapperWithNav;
