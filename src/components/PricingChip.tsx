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
    >
      <div className="rounded-2xl border-2 border-transparent bg-white p-4 text-start shadow-xl hover:border-indigo-500">
        <p className="text-xl">{plan.name}</p>
        <p className="text-sm text-gray-500">{plan.desc}</p>
        <div className="mt-4 text-3xl font-semibold text-indigo-500">
          ${frequency === "yearly" ? plan.yearly.price : plan.monthly.price}{" "}
          <span className="text-xl font-normal text-gray-600">/mo</span>
        </div>
      </div>
    </button>
  );
};

export default PricingChip;
