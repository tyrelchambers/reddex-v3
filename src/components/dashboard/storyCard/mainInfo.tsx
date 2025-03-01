const StoryCardInfo = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  return <div className="flex flex-col gap-3">{children}</div>;
};
export default StoryCardInfo;
