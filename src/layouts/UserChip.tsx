import React from "react";
import { api } from "~/utils/api";

const UserChip = () => {
  const userQuery = api.user.me.useQuery();
  const user = userQuery.data;

  return (
    <p className="text-gray-800 underline hover:text-rose-500 dark:text-gray-200">
      {user?.name}
    </p>
  );
};

export default UserChip;
