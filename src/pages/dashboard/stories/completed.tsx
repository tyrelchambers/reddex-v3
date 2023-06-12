import React from "react";
import StoryListItem from "~/components/StoryListItem";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Completed = () => {
  const completedListQuery = api.post.getCompletedList.useQuery();

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex w-full flex-col">
        <header className="flex w-full flex-1 justify-between">
          <div className="flex flex-col">
            <h1 className="h1 text-2xl">Completed list</h1>
            <p className="font-light text-gray-700">
              Your list of stories for which you have read.
            </p>
          </div>

          <button type="button" className="button alt">
            Remove all
          </button>
        </header>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {completedListQuery.data?.map((item) => (
            <StoryListItem key={item.id} story={item} list="completed" />
          )) || null}
        </div>
      </section>
    </WrapperWithNav>
  );
};

export default Completed;
