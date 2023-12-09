import React from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";

import { api } from "~/utils/api";

import OverviewStats from "~/components/overview/OverviewStats";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";

const Overview = () => {
  const { data: overviewData } = api.overview.overview.useQuery();

  return (
    <WrapperWithNav>
      <header className="mb-10">
        <h1 className="text-2xl text-foreground">Overview</h1>
      </header>

      <OverviewStats
        data={{
          approvedStoriesCount: overviewData?.approvedStoriesCount,
          completedStoriesCount: overviewData?.completedStoriesCount,
          submittedStoriesCount: overviewData?.submittedStoriesCount,
        }}
      />

      <section className="my-20 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="h-full bg-background p-6">
            <h2 className="text-xl text-foreground">
              Recently submitted stories
            </h2>

            <section className="mt-8 flex flex-col gap-4">
              {overviewData?.submittedStories.map((story) => {
                return (
                  <div key={story.id} className="flex">
                    <Link
                      href={`/story/${story.id}`}
                      className="flex-1 text-foreground underline hover:text-primary"
                    >
                      {story.title}
                    </Link>
                  </div>
                );
              })}
            </section>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="bg-background p-6">
            <h2 className="text-xl text-foreground">
              Recently approved stories
            </h2>

            <section className="mt-8 flex flex-col gap-4">
              {overviewData?.approvedStories?.map((story) => {
                return (
                  <div key={story.id} className="flex">
                    <Link
                      href={`/story/${story.id}`}
                      className="flex-1 text-foreground underline hover:text-primary"
                    >
                      {story.title}
                    </Link>
                  </div>
                );
              })}
            </section>
          </CardContent>
        </Card>
      </section>
    </WrapperWithNav>
  );
};

export default Overview;
