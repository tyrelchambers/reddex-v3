import React from "react";

const StoryCardBody = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  return <div className="flex gap-3">{children}</div>;
};

export default StoryCardBody;
