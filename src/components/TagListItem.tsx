import { faHashtag } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RedditPost, Tag, TagsOnStories } from "@prisma/client";
import React from "react";

interface Props {
  tag: Tag & { TagsOnStories: { RedditPost: RedditPost; tag: Tag }[] };
}

const TagListItem = ({ tag }: Props) => {
  return (
    <div
      key={tag.id}
      className="flex flex-col justify-between overflow-hidden rounded-xl shadow-md"
    >
      <header className="flex bg-indigo-700 p-4">
        <p className="flex items-center gap-3 text-white">
          <FontAwesomeIcon icon={faHashtag} />
          {tag.tag}
        </p>
      </header>

      <div className="flex flex-1 p-3">
        {tag.TagsOnStories.length ? (
          tag.TagsOnStories.map((story, id) => (
            <p key={id}>{story.RedditPost.title}</p>
          ))
        ) : (
          <p className="italic text-gray-400">
            No stories attached to this tag
          </p>
        )}
      </div>

      <footer className="flex justify-end bg-gray-100 p-4">
        <button className="button simple !text-red-500">Delete</button>
      </footer>
    </div>
  );
};

export default TagListItem;
