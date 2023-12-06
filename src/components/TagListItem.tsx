import { faHashtag } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RedditPost, Tag } from "@prisma/client";
import React from "react";
import { Button } from "./ui/button";
import { api } from "~/utils/api";

interface Props {
  tag: Tag & { TagsOnStories: { RedditPost: RedditPost; tag: Tag }[] };
}

const TagListItem = ({ tag }: Props) => {
  const apiContext = api.useUtils();
  const deleteTag = api.tag.delete.useMutation({
    onSuccess: () => {
      apiContext.tag.all.invalidate();
    },
  });

  return (
    <div
      key={tag.id}
      className="flex flex-col justify-between overflow-hidden rounded-xl shadow-md"
    >
      <header className="flex bg-card p-4">
        <p className="flex items-center gap-3 text-card-foreground">
          <FontAwesomeIcon icon={faHashtag} />
          {tag.tag}
        </p>
      </header>

      <footer className="flex justify-end p-2 px-4">
        <Button onClick={() => deleteTag.mutate(tag.id)}>Delete</Button>
      </footer>
    </div>
  );
};

export default TagListItem;
