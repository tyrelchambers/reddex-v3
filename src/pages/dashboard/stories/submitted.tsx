import React, { useState } from "react";
import ReadStories from "~/components/dashboard/submittedStories/ReadStories";
import UnreadStories from "~/components/dashboard/submittedStories/UnreadStories";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { logger } from "~/lib/logger";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Submitted = () => {
  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");
  const submittedStories = api.story.submittedList.useQuery();

  const stories = submittedStories.data;

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <Tabs defaultValue="unread" className="w-full px-4">
        <header className="mb-4 flex w-full flex-1 flex-col justify-between gap-2 lg:flex-row lg:px-0">
          <div className="flex flex-col">
            <h1 className="text-foreground text-2xl font-bold">Submitted</h1>
            <p className="text-muted-foreground font-light">
              These are your stories submitted via your website.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md">
            <Input
              placeholder="Search by keywords"
              value={query}
              className="w-full"
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          </div>
        </header>
        <TabsList>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
        <TabsContent value="unread">
          <UnreadStories regex={regex} stories={stories ?? []} />
        </TabsContent>
        <TabsContent value="read">
          <ReadStories regex={regex} stories={stories ?? []} />
        </TabsContent>
      </Tabs>
    </WrapperWithNav>
  );
};

export default Submitted;
