import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FontAwesomeIcon icon={faSpinner} spin className="text-primary" />
        <p className="text-2xl font-light text-foreground/70">
          Loading account data...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
