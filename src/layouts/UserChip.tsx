import React from "react";
import { api } from "~/utils/api";

const UserChip = () => {
  const userQuery = api.user.me.useQuery();
  const user = userQuery.data;

  return (
    <div className="flex items-center gap-6 rounded-lg bg-indigo-500 px-3 py-2 shadow-md hover:bg-indigo-600">
      <p className="text-gray-100">{user?.name}</p>
    </div>
  );
};

export default UserChip;
