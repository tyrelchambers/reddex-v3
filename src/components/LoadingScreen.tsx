import React from "react";
import { Loader } from "@mantine/core";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader variant="dots" color="pink" size="xl" />
        <p className="text-2xl font-light text-foreground/70">
          Loading account data...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
