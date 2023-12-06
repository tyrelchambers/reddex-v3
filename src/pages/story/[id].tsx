import { useRouter } from "next/router";
import React from "react";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Story = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const submittedStory = api.story.storyById.useQuery(id, {
    enabled: !!id,
  });

  const story = submittedStory.data;

  const title = story?.title || `A story by: ${story?.author ?? "unknown"}`;

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground">By: {story?.author}</p>

      <div
        dangerouslySetInnerHTML={{ __html: story?.body || "" }}
        className="mt-10 w-full max-w-xl whitespace-pre-wrap leading-relaxed text-foreground/80"
      ></div>
    </WrapperWithNav>
  );
};

export default Story;
