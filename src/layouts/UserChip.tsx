import { faChevronDown } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "@mantine/core";
import React from "react";
import { api } from "~/utils/api";

const UserChip = () => {
  const userQuery = api.user.me.useQuery();
  const user = userQuery.data;

  return (
    <div className="flex items-center gap-6 rounded-full bg-gray-100 px-3 py-2 hover:bg-rose-100">
      <p className="text-rose-700">{user?.name}</p>
      <FontAwesomeIcon icon={faChevronDown} className="text-rose-500" />
    </div>
  );
};

export default UserChip;
