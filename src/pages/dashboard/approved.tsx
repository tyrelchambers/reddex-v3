import React from "react";
import StoryListItem from "~/components/StoryListItem";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { api } from "~/utils/api";

const Approved = () => {
  const approvedListQuery = api.post.getApprovedList.useQuery();

  return (
    <div>
      <Header />
      <DashNav />

      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-2xl">Approved list</h1>
        <p className=" text-gray-500">
          Your list of stories for which you have permission to read.
        </p>

        <div className="mt-6 grid grid-cols-3">
          {approvedListQuery.data?.map((item) => (
            <StoryListItem key={item.id} story={item} list="approved" />
          )) || null}
        </div>
      </main>
    </div>
  );
};

export default Approved;
