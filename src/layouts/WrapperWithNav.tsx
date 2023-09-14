import React, { useEffect, useState } from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";
import Spinner from "~/components/Spinner";
import AuthenticationBoundary from "./AuthenticationBoundary";
import { useViewportSize } from "@mantine/hooks";
import { breakpoints } from "~/constants";
import { useUserStore } from "~/stores/useUserStore";
import { hasActiveSubscription } from "~/utils";
import WrongPlanBanner from "~/components/WrongPlanBanner";
import { routes } from "~/routes";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs?: Tab[];
  loading?: boolean;
  loadingMessage?: string;
}

const WrapperWithNav = ({ children, tabs, loading, loadingMessage }: Props) => {
  const [loadDashboardOrBanner, setLoadDashboardOrBanner] = useState<
    boolean | undefined
  >(undefined);

  const { width } = useViewportSize();
  const { user } = useUserStore();
  const router = useRouter();

  const allowedRoutesWithoutPlan = [
    routes.SETTINGS_ACCOUNT,
    routes.SETTINGS_PROFILE,
  ];

  useEffect(() => {
    if (user) {
      setLoadDashboardOrBanner(
        user.hasActiveSubscription ||
          allowedRoutesWithoutPlan.includes(router.asPath)
      );
    }
  }, [user, router.asPath]);

  return (
    <>
      <Header />
      {width >= breakpoints.tablet && <DashNav />}
      {loadDashboardOrBanner === undefined ? null : loadDashboardOrBanner ? (
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
      ) : (
        <WrongPlanBanner
          title="Please sign up with a plan"
          text="In order to make the most of your account, please select a plan."
          type="upgrade_plan"
        />
      )}
    </>
  );
};

export default WrapperWithNav;
