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
      <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl bg-accent p-4 shadow-lg">
        <div className="flex w-full flex-col">
          <p className="text-accent-foreground">{title}</p>
          <p className="text-sm font-thin text-accent-foreground">{subtitle}</p>
        </div>

        {action}
      </div>
    );
  }

  return (
    <div className="mt-6 flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex w-full flex-col">
        <p className="text-card-foreground">{title}</p>
        <p className="text-sm font-thin text-muted-foreground">{subtitle}</p>
      </div>

      {action}
    </div>
  );
};

export default StatusBanner;
