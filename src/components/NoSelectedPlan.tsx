import { plans } from "~/constants";
import PricingChip from "./PricingChip";
import PricingFrequencySelect from "./PricingFrequencySelect";
import { Divider } from "@mantine/core";

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  frequency: "yearly" | "monthly";
  setFrequency: React.Dispatch<React.SetStateAction<"yearly" | "monthly">>;
  selectedPlan?: string | null;
}

const NoSelectedPlan = ({
  setSelectedPlanHandler,
  frequency,
  setFrequency,
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
      <Divider className="my-8" />

      <div className="flex flex-col gap-6">
        <PricingFrequencySelect
          frequency={frequency}
          setFrequency={setFrequency}
        />
        {plans.map((item) => (
          <PricingChip
            plan={item}
            setSelectedPlanHandler={setSelectedPlanHandler}
            frequency={frequency}
            key={item.name}
            isSelected={
              frequency === "yearly"
                ? item.yearly.productId === selectedPlan
                : item.monthly.productId === selectedPlan
            }
          />
        ))}
      </div>
    </div>
  );
};

export default NoSelectedPlan;
