import React from "react";

interface Props {
  label: string;
}

const EmptyState = ({ label }: Props) => {
  return (
    <div className="mt-6 flex w-full justify-center rounded-xl bg-muted p-8">
      <p className="font-normal text-muted-foreground">
        Nothing to show {label && `for ${label}`}
      </p>
    </div>
  );
};

export default EmptyState;
