import React, { useEffect, useState } from "react";
import TabsList from "~/components/TabsList";
import Header from "./Header";
import DashNav from "./DashNav";
import { Tab } from "~/types";
import Spinner from "~/components/Spinner";
import AuthenticationBoundary from "./AuthenticationBoundary";
import WrongPlanBanner from "~/components/WrongPlanBanner";
import { routes } from "~/routes";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface Props {
  children: React.ReactNode[] | React.ReactNode;
  tabs?: Tab[];
  loading?: boolean;
  loadingMessage?: string;
  className?: string;
}

const WrapperWithNav = ({
  children,
  tabs,
  loading,
  loadingMessage,
  className,
}: Props) => {
  const [loadDashboardOrBanner, setLoadDashboardOrBanner] = useState<
    boolean | undefined
  >(undefined);

  const { data: user } = api.user.me.useQuery();
  const router = useRouter();
  const { status } = useSession();

  const allowedRoutesWithoutPlan = [
    routes.SETTINGS_ACCOUNT,
    routes.SETTINGS_PROFILE,
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(routes.HOME);
    }
  }, [status, router.isReady]);

  useEffect(() => {
    if (user) {
      setLoadDashboardOrBanner(
        !!user.subscription || allowedRoutesWithoutPlan.includes(router.asPath),
      );
    }
  }, [user, router.asPath]);

  if (status === "unauthenticated") return null;

  const classes = className
    ? className
    : `mx-auto xl:my-6 flex  ${tabs ? "xl:grid xl:grid-cols-[250px_1fr]" : ""} w-full max-w-screen-2xl flex-col xl:flex-row gap-6`;
  const bodyClasses = "flex w-full px-4 xl:px-0";

  return (
    <>
      <Header />
      <DashNav />
      {loadDashboardOrBanner === undefined ? null : loadDashboardOrBanner ? (
        <AuthenticationBoundary>
          <section className={classes}>
            {tabs && (
              <header className="w-full">
                <TabsList tabs={tabs} />
              </header>
            )}
            <section className={bodyClasses}>
              {loading ? <Spinner message={loadingMessage} /> : children}
            </section>
          </section>
        </AuthenticationBoundary>
      ) : (
        <WrongPlanBanner
          title="Please sign up for a plan"
          text="In order to make the most of your account, please select a plan."
          type="upgrade_plan"
        />
      )}
    </>
  );
};

export default WrapperWithNav;
