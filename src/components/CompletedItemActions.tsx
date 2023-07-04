import React from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";

interface Props {
  postId: string;
}

const CompletedItemActions = ({ postId }: Props) => {
  const apiContext = api.useContext();
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
    deleteStory.mutate(postId);
  };
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={deleteStoryHandler}>
        Delete
      </Button>
      <Button onClick={() => addToApproved.mutate(postId)}>
        Add to reading list
      </Button>
    </div>
  );
};

export default CompletedItemActions;
