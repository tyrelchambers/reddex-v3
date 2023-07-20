import React from "react";
import Spinner from "~/components/Spinner";

interface Props {
  isLoading: boolean;
  loadingMessage: string;
  children: React.ReactNode | React.ReactNode[];
}

const BodyWithLoader = ({ isLoading, loadingMessage, children }: Props) => {
  if (isLoading) return <Spinner message={loadingMessage} />;

  return (
    <section className="flex w-full max-w-2xl flex-col">{children}</section>
  );
};

export default BodyWithLoader;
