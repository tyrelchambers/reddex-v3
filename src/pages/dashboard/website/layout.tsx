import React from "react";
import { Switch } from "~/components/ui/switch";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import DashboardSection from "~/layouts/DashboardSection";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { LayoutEnum } from "~/server/schemas";
import { api } from "~/utils/api";

const layouts: { title: string; description: string; layout: LayoutEnum }[] = [
  {
    title: "Youtube stats",
    description: "Show stats about your channel on your site.",
    layout: "youtube_stats",
  },
  {
    title: "Latest Episodes",
    description: "Show your latest episodes on your site.",
    layout: "latest_episodes",
  },
  {
    title: "Story submissions graph",
    description: "Show your story submissions graph on your site.",
    layout: "story_submissions_graph",
  },
  {
    title: "Leaderboards graph",
    description: "Show your leaderboards graph on your site.",
    layout: "leaderboards_graph",
  },
];

const WebsiteLayout = () => {
  const websiteSettings = api.website.settings.useQuery();
  const updateLayout = api.website.layouts.useMutation();

  const updateHandler = (enabled: boolean, data: LayoutEnum) => {
    const existingLayout = websiteSettings.data?.WebsiteLayouts.find(
      (l) => l.layout === data,
    );
    console.log(existingLayout);

    updateLayout.mutate({
      enabled,
      layout: data,
      id: existingLayout?.id,
    });
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading website integrations..."
      >
        <DashboardSection
          title="Layout"
          subtitle="Enable certain layout features on your site."
          className="max-w-2xl"
        >
          <div className="flex flex-col gap-8">
            {layouts.map((layout) => (
              <div
                key={layout.title}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{layout.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {layout.description}
                  </p>
                </div>
                <Switch
                  defaultChecked={websiteSettings.data?.WebsiteLayouts.some(
                    (l) => l.layout === layout.layout && l.enabled,
                  )}
                  onCheckedChange={(v) => updateHandler(v, layout.layout)}
                />
              </div>
            ))}
          </div>
        </DashboardSection>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default WebsiteLayout;
