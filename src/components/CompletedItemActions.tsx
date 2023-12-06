import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { MixpanelEvents } from "~/types";

interface Props {
  postId: string;
}

const CompletedItemActions = ({ postId }: Props) => {
  const { data } = useSession();

  const apiContext = api.useUtils();
  const deleteStory = api.story.deleteStory.useMutation({
    onSuccess: () => {
      apiContext.story.getCompletedList.invalidate();
    },
  });
  const addToApproved = api.story.addToApproved.useMutation({
    onSuccess: () => {
      apiContext.story.getCompletedList.invalidate();
    },
  });

  const deleteStoryHandler = () => {
    trackUiEvent(MixpanelEvents.DELETE_STORY, {
      postId: postId,
      userId: data?.user.id,
    });
    deleteStory.mutate(postId);
  };
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={deleteStoryHandler}>
        Delete
      </Button>
      <Button
        onClick={() => {
          trackUiEvent(MixpanelEvents.ADD_TO_APPROVED, {
            postId: postId,
            userId: data?.user.id,
          });
          addToApproved.mutate(postId);
        }}
      >
        Add to reading list
      </Button>
    </div>
  );
};

export default CompletedItemActions;
