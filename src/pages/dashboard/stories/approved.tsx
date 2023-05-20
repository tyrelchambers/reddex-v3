import { faSearch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import React, { useState } from "react";
import StoryListItem from "~/components/StoryListItem";
import StoriesWrapper from "~/layouts/StoriesWrapper";
import { api } from "~/utils/api";

const Approved = () => {
  const approvedListQuery = api.post.getApprovedList.useQuery();

  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");

  return (
    <StoriesWrapper>
      <header className="flex flex-1 justify-between">
        <div className="flex flex-col">
          <h1 className="h1 text-2xl">Approved list</h1>
          <p className=" text-gray-500">
            Your list of stories for which you have permission to read.
          </p>
        </div>

        <div className="flex h-9 gap-3">
          <TextInput
            placeholder="Search by keywords"
            icon={<FontAwesomeIcon icon={faSearch} />}
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />

          <button type="button" className="button secondary !max-h-full">
            Import story
          </button>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {approvedListQuery.data
          ?.filter(
            (item) => item.title.match(regex) || item.author.match(regex)
          )
          ?.map((item) => (
            <StoryListItem key={item.id} story={item} list="approved" />
          )) || null}
      </div>
    </StoriesWrapper>
  );
};

export default Approved;
