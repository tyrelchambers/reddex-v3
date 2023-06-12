import React from "react";

interface Props {
  label: string;
}

const EmptyState = ({ label }: Props) => {
  return (
    <div className="mt-6 flex w-full justify-center rounded-xl bg-gray-50 p-8">
      <p className="font-normal text-gray-700">
        Nothing to show {label && `for ${label}`}
      </p>
    </div>
  );
};

export default EmptyState;
