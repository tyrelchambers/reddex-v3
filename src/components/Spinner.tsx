import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Spinner = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-fit w-full items-center justify-center gap-4 rounded-xl bg-card p-4">
      <FontAwesomeIcon icon={faSpinner} spin className="text-primary" />
      <p className="text-card-foreground">{message}</p>
    </div>
  );
};

export default Spinner;
