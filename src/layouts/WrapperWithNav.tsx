import React from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";
import Spinner from "~/components/Spinner";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs: Tab[];
  loading?: boolean;
  loadingMessage?: string;
}

const WrapperWithNav = ({ children, tabs, loading, loadingMessage }: Props) => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex w-full max-w-screen-2xl gap-14">
        <header className="w-48">
          <TabsList tabs={tabs} />
        </header>
        {loading ? <Spinner message={loadingMessage} /> : children}
      </main>
    </>
  );
};

export default WrapperWithNav;
