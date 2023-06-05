import React from "react";
import { api } from "~/utils/api";

const UserChip = () => {
  const userQuery = api.user.me.useQuery();
  const user = userQuery.data;

  return (
    <div className="flex items-center gap-6 rounded-full bg-neutral-100 px-6 py-3  hover:bg-neutral-200">
      <p className="text-gray-800">{user?.name}</p>
    </div>
  );
};

export default UserChip;
