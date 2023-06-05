import React from "react";

interface Props {
  type?: "primary" | "secondary";
  title: string;
  subtitle: string;
  action: React.ReactNode;
}

const StatusBanner = ({ type = "primary", title, subtitle, action }: Props) => {
  if (type === "primary") {
    return (
      <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl bg-indigo-500 p-4 shadow-lg">
        <div className="flex flex-col">
          <p className="text-white">{title}</p>
          <p className="text-sm font-thin text-gray-200">{subtitle}</p>
        </div>

        {action}
      </div>
    );
  }

  return (
    <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl bg-gray-100 p-4">
      <div className="flex flex-col">
        <p className="text-gray-700">{title}</p>
        <p className="text-sm font-thin text-gray-500">{subtitle}</p>
      </div>

      {action}
    </div>
  );
};

export default StatusBanner;
