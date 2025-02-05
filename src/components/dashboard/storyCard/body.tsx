import React from "react";

const StoryCardBody = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  return <div className="flex flex-col gap-3 sm:flex-row">{children}</div>;
};

export default StoryCardBody;
