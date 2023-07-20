import React from "react";

interface Props {
  label: string;
}

const EmptyState = ({ label }: Props) => {
  return (
    <div className="mt-6 flex w-full justify-center rounded-xl bg-card p-8">
      <p className="text-center font-normal text-card-foreground/60">
        Nothing to show {label && `for ${label}`}
      </p>
    </div>
  );
};

export default EmptyState;
