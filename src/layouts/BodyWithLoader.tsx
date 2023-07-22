import React from "react";
import Spinner from "~/components/Spinner";
import WrongPlanBanner from "~/components/WrongPlanBanner";

interface Props {
  isLoading: boolean;
  loadingMessage: string;
  children: React.ReactNode | React.ReactNode[];
  hasProPlan?: boolean;
}

const BodyWithLoader = ({
  isLoading,
  loadingMessage,
  children,
  hasProPlan,
}: Props) => {
  if (isLoading) return <Spinner message={loadingMessage} />;

  return (
    <div className="flex w-full max-w-2xl flex-col">
      {!hasProPlan && <WrongPlanBanner />}
      {children}
    </div>
  );
};

export default BodyWithLoader;
