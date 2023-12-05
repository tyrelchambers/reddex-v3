import { useSession } from "next-auth/react";
import React from "react";
import EmptyState from "~/components/EmptyState";
import StoryListItem from "~/components/StoryListItem";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Completed = () => {
  const { data } = useSession();
  const apiContext = api.useUtils();
  const completedListQuery = api.story.getCompletedList.useQuery();
  const removeAll = api.story.removeAllFromCompletedList.useMutation({
    onSuccess: () => {
      apiContext.story.getCompletedList.invalidate();
    },
  });

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <section className="flex w-full flex-col">
        <header className="flex w-full flex-1 flex-col justify-between px-4 lg:flex-row lg:px-0">
          <div className="flex flex-col">
            <h1 className="text-2xl text-foreground">Completed list</h1>
            <p className="font-light text-muted-foreground">
              Your list of stories for which you have read.
            </p>
          </div>

          <Button
            variant="secondary"
            className="mt-4 lg:mt-0"
            onClick={() => {
              trackUiEvent(MixpanelEvents.REMOVE_ALL_COMPLETED_STORIES, {
                userId: data?.user?.id,
              });
              removeAll.mutate();
            }}
          >
            Remove all
          </Button>
        </header>

        {completedListQuery.data && completedListQuery.data.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3">
            {completedListQuery.data?.map((item) => (
              <StoryListItem key={item.id} story={item} list="completed" />
            )) || null}
          </div>
        ) : (
          <EmptyState label="completed stories" />
        )}
      </section>
    </WrapperWithNav>
  );
};

export default Completed;
