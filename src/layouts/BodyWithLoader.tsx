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
      {!hasProPlan && (
        <WrongPlanBanner
          title="Insufficient plan"
          text="You'll need to upgrade to the Pro plan in order to use this feature. In the meantime, if you had a website created, it will be hidden until your plan is upgraded."
          type="upgrade_plan"
        />
      )}
      {children}
    </div>
  );
};

export default BodyWithLoader;
