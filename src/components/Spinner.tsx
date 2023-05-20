import { Loader, Text } from "@mantine/core";
import React from "react";

const Spinner = ({ message }: { message: string }) => {
  return (
    <div className="flex h-fit w-full items-center justify-center gap-4 rounded-xl bg-gray-50 p-4">
      <Loader color="indigo" size="sm" />
      <Text className="text-gray-500">{message}</Text>
    </div>
  );
};

export default Spinner;
