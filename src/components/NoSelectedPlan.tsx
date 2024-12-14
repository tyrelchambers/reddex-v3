import { plans } from "~/constants";
import PricingChip from "./PricingChip";
import { Separator } from "./ui/separator";

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
      <p className="mb-2 text-2xl text-card-foreground">
        Looks like we haven&apos;t chosen a plan yet!
      </p>
      <p className="text-card-foreground/70">
        That&apos;s okay, just select one below and we will get started.
      </p>
      <Separator className="my-8" />

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
