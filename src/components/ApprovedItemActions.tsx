import React from "react";
import { api } from "~/utils/api";

interface Props {
  postId: string;
}

const ApprovedItemActions = ({ postId }: Props) => {
  const apiContext = api.useContext();
  const addToCompleted = api.post.addToCompleted.useMutation({
    onSuccess: () => {
      apiContext.post.getApprovedList.invalidate();
    },
  });

  return (
    <div className="flex gap-3">
      <button className="button alt">Add tags</button>
      <button
        className="button main"
        onClick={() => addToCompleted.mutate(postId)}
      >
        Mark as read
      </button>
    </div>
  );
};

export default ApprovedItemActions;
