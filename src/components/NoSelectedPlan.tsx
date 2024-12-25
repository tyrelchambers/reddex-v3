import { plans } from "~/constants";
import PricingChip from "./PricingChip";

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  selectedPlan?: string | null;
}

const NoSelectedPlan = ({
  setSelectedPlanHandler,
  selectedPlan,
}: NoSelectedPlanProps) => {
  return (
    <div className="my-4 flex flex-col rounded-2xl bg-card p-8">
      <div className="flex flex-col gap-6">
        {plans.map((item) => (
          <PricingChip
            isSelected={selectedPlan === item.name}
            plan={item}
            setSelectedPlanHandler={setSelectedPlanHandler}
            key={item.name}
          />
        ))}
      </div>
    </div>
  );
};

export default NoSelectedPlan;
