import { useSession } from "next-auth/react";
import React, { useState } from "react";
import EmptyState from "~/components/EmptyState";
import StoryListItem from "~/components/StoryListItem";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import ImportStoryForm from "~/forms/ImportStoryForm";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const Approved = () => {
  const { data } = useSession();
  const approvedListQuery = api.story.getApprovedList.useQuery();

  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <header className="flex flex-1 flex-col justify-between px-4 lg:px-0 xl:flex-row">
        <div className="mb-6 flex flex-col lg:mb-0">
          <h1 className="text-2xl text-foreground">Approved list</h1>
          <p className="font-light text-muted-foreground">
            Your list of stories for which you have permission to read.
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 flex-col">
            <Input
              placeholder="Search by keywords"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  trackUiEvent(MixpanelEvents.IMPORT_STORY, {
                    userId: data?.user.id,
                  });
                }}
              >
                Import story
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import a story</DialogTitle>
              </DialogHeader>
              <ImportStoryForm />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {approvedListQuery.data && approvedListQuery.data.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {approvedListQuery.data
            .filter(
              (item) => item.title.match(regex) || item.author.match(regex),
            )
            ?.map((item) => (
              <StoryListItem key={item.id} story={item} list="approved" />
            )) || null}
        </div>
      ) : (
        <EmptyState label="approved stories" />
      )}
    </WrapperWithNav>
  );
};

export default Approved;
