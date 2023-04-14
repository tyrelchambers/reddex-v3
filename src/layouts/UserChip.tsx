import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "@mantine/core";
import React from "react";
import { api } from "~/utils/api";

const UserChip = () => {
  const userQuery = api.user.me.useQuery();
  const user = userQuery.data;

  return (
    <div className="flex items-center gap-6 rounded-full border-[1px] border-indigo-300 px-3 py-2 hover:bg-indigo-50">
      <p className="text-indigo-700">{user?.name}</p>
      <FontAwesomeIcon icon={faChevronDown} className="text-indigo-500" />
    </div>
  );
};

export default UserChip;
