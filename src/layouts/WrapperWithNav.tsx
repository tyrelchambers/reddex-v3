import React, { useEffect } from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";
import Spinner from "~/components/Spinner";
import AuthenticationBoundary from "./AuthenticationBoundary";
import { useUserStore } from "~/stores/useUserStore";
import { api } from "~/utils/api";
import { hasActiveSubscription } from "~/utils";
import { useRouter } from "next/router";
import { routeWhitelist, routes } from "~/routes";
import { toast } from "react-toastify";
import { useSubscribed } from "~/hooks/useSubscribed";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs?: Tab[];
  loading?: boolean;
  loadingMessage?: string;
}

const WrapperWithNav = ({ children, tabs, loading, loadingMessage }: Props) => {
  const userStore = useUserStore();
  useSubscribed();
  const userQuery = api.user.me.useQuery();

  useEffect(() => {
    if (userQuery.data) {
      userStore.setUser(userQuery.data);
    }
  }, [userQuery.data]);

  return (
    <>
      <Header />
      <DashNav />
      <AuthenticationBoundary>
        <main className="mx-auto my-6 flex w-full max-w-screen-2xl flex-col gap-8 lg:flex-row lg:gap-14">
          {tabs && (
            <header className="w-full lg:w-48">
              <TabsList tabs={tabs} />
            </header>
          )}
          <section className="w-full max-w-screen-2xl px-4 xl:px-4">
            {loading ? <Spinner message={loadingMessage} /> : children}
          </section>
        </main>
      </AuthenticationBoundary>
    </>
  );
};

export default WrapperWithNav;
