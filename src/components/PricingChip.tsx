import clsx from "clsx";
import React from "react";
import { Plan } from "~/constants";

interface NoSelectedPlanProps {
  setSelectedPlanHandler: (id: string) => void;
  plan: Plan;
  isSelected: boolean;
}
const PricingChip = ({
  setSelectedPlanHandler,
  plan,
  isSelected,
}: NoSelectedPlanProps) => {
  return (
    <button type="button" data-testid={`pricing-chip-${plan.name}`}>
      <div
        className={clsx(
          "rounded-2xl border-2 border-transparent bg-background p-4 text-start shadow-xl hover:border-accent",
          {
            "!border-accent !bg-accent/10": isSelected,
          },
        )}
      >
        <p className="text-xl text-foreground">{plan.name}</p>
        <p className="text-sm text-foreground/70">{plan.desc}</p>{" "}
        <div className="mt-4 text-3xl font-semibold text-accent">
          {plan.price}
          <span className="text-xl font-normal text-muted-foreground">
            /month
          </span>
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            CAD
          </span>
        </div>
      </div>
    </button>
  );
};

export default PricingChip;
