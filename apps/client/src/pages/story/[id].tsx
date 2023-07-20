import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Story = () => {
  const router = useRouter();
  const apiContext = api.useContext();
  const id = router.query.id as string;

  const submittedStory = api.story.storyById.useQuery(id, {
    enabled: !!id,
  });

  const completeStory = api.story.completeStory.useMutation({
    onSuccess: () => {
      apiContext.story.storyById.invalidate();
    },
  });

  const story = submittedStory.data;

  const title = story?.title || `A story by: ${story?.author ?? "unknown"}`;

  const completeStoryHandler = (bool: boolean) => {
    if (story) {
      completeStory.mutate({
        completed: bool,
        id: story.id,
      });
    }
  };

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <h1 className="texzt-3xl text-foreground">{title}</h1>
      <p className="text-muted-foreground">By: {story?.author}</p>

      <div className="my-6">
        {story?.completed ? (
          <Button variant="outline" onClick={() => completeStoryHandler(false)}>
            Mark as unread
          </Button>
        ) : (
          <Button variant="outline" onClick={() => completeStoryHandler(true)}>
            Mark as read
          </Button>
        )}
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: story?.body || "" }}
        className="mt-10 w-full max-w-xl whitespace-pre-wrap leading-relaxed text-foreground/80"
      ></div>
    </WrapperWithNav>
  );
};

export default Story;
