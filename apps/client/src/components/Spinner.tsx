import { Loader, Text } from "@mantine/core";
import React from "react";

const Spinner = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-fit w-full items-center justify-center gap-4 rounded-xl bg-card p-4">
      <Loader color="pink" size="sm" />
      <Text className="text-card-foreground">{message}</Text>
    </div>
  );
};

export default Spinner;
