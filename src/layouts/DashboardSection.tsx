import clsx from "clsx";
import React from "react";
interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode | React.ReactNode[];
  background?: boolean;
}

const DashboardSection = ({
  title,
  subtitle,
  background = true,
  children,
}: Props) => {
  return (
    <div className="my-4">
      <header className="mb-4">
        <h3 className="text-2xl font-medium text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </header>

      <section
        className={clsx(
          "flex flex-col gap-4",
          background && "rounded-xl bg-card p-4",
        )}
      >
        {children}
      </section>
    </div>
  );
};

export default DashboardSection;
