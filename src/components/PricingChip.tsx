import React from "react";
import { Plan } from "~/constants";

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  frequency: "yearly" | "monthly";
  plan: Plan;
}
const PricingChip = ({
  setSelectedPlanHandler,
  frequency,
  plan,
}: NoSelectedPlanProps) => {
  return (
    <button
      type="button"
      onClick={() =>
        setSelectedPlanHandler(
          frequency === "yearly"
            ? plan.yearly.productId
            : plan.monthly.productId
        )
      }
      data-testid={`pricing-chip-${plan.name}`}
    >
      <div className="rounded-2xl border-2 border-transparent bg-background p-4 text-start shadow-xl hover:border-accent">
        <p className="text-xl text-foreground">{plan.name}</p>
        <p className="text-sm text-foreground/70">{plan.desc}</p>
        <div className="mt-4 text-3xl font-semibold text-accent">
          ${frequency === "yearly" ? plan.yearly.price : plan.monthly.price}{" "}
          <span className="text-xl font-normal text-muted-foreground">
            {frequency === "yearly" ? "/year" : "/month"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default PricingChip;
