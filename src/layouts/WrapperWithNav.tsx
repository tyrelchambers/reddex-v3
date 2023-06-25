import React from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";
import Spinner from "~/components/Spinner";
import AuthenticationBoundary from "./AuthenticationBoundary";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs?: Tab[];
  loading?: boolean;
  loadingMessage?: string;
}

const WrapperWithNav = ({ children, tabs, loading, loadingMessage }: Props) => {
  return (
    <>
      <Header />
      <DashNav />
      <AuthenticationBoundary>
        <main className="mx-auto my-6 flex w-full max-w-screen-2xl gap-14">
          {tabs && (
            <header className="w-48">
              <TabsList tabs={tabs} />
            </header>
          )}
          <section className="w-full max-w-screen-2xl">
            {loading ? <Spinner message={loadingMessage} /> : children}
          </section>
        </main>
      </AuthenticationBoundary>
    </>
  );
};

export default WrapperWithNav;
