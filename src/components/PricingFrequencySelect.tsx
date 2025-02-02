import clsx from "clsx";
import React from "react";

interface Props {
  frequency: "yearly" | "monthly";
  setFrequency: React.Dispatch<React.SetStateAction<"yearly" | "monthly">>;
}

const PricingFrequencySelect = ({ frequency, setFrequency }: Props) => {
  return (
    <div className="relative flex justify-center">
      <div className="rounded-full bg-background p-1">
        <button
          className={clsx(
            "rounded-full px-4 py-2 text-sm font-semibold text-foreground duration-150",
            {
              "bg-accent text-accent-foreground!": frequency === "yearly",
            }
          )}
          type="button"
          onClick={() => setFrequency("yearly")}
        >
          Yearly
        </button>
        <button
          onClick={() => setFrequency("monthly")}
          className={clsx(
            "rounded-full px-4 py-2 text-sm font-semibold text-foreground duration-150",
            {
              "bg-accent text-accent-foreground!": frequency === "monthly",
            }
          )}
          type="button"
        >
          Monthly
        </button>
      </div>
    </div>
  );
};

export default PricingFrequencySelect;
