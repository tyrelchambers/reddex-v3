import clsx from "clsx";
import React from "react";

interface Props {
  isInQueue?: boolean;
  children: React.ReactNode;
}

const StoryCard = ({ children, isInQueue }: Props) => {
  const activeClasses = {
    header: clsx(isInQueue && "border-2 border-accent"),
  };
  return (
    <div
      className={clsx(
        "bg-card flex flex-col gap-3 overflow-hidden rounded-xl p-5 shadow-lg",
        activeClasses.header,
      )}
    >
      {children}
    </div>
  );
};

export default StoryCard;
