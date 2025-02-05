import Link from "next/link";
import React from "react";

interface Props {
  url: string;
  title: string | null;
  author: string | null;
}

const StoryCardHeader = ({ author, url, title }: Props) => {
  return (
    <div className="-mt-2 flex flex-col gap-2">
      <Link
        className="text-foreground text-xl font-bold underline hover:text-rose-500"
        href={url}
        target="_blank"
      >
        {title || "<This story is missing a title>"}
      </Link>
      <div className="text-foreground flex items-center rounded-full text-sm">
        <span className="font-foreground/70 text-xs">by</span>{" "}
        <span className="ml-1 font-semibold">
          {author || "<This story is missing an author>"}
        </span>
      </div>
    </div>
  );
};

export default StoryCardHeader;
