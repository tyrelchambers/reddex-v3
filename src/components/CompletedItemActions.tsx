import React from "react";
import { api } from "~/utils/api";

interface Props {
  postId: string;
}

const CompletedItemActions = ({ postId }: Props) => {
  const apiContext = api.useContext();
  const addToApproved = api.story.addToApproved.useMutation({
    onSuccess: () => {
      apiContext.post.getCompletedList.invalidate();
    },
  });
  return (
    <div className="flex gap-3">
      <button className="button alt">Add tags</button>
      <button
        className="button main"
        onClick={() => addToApproved.mutate(postId)}
      >
        Mark as read
      </button>
    </div>
  );
};

export default CompletedItemActions;
