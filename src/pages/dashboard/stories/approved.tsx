import { faSearch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextInput } from "@mantine/core";
import React, { useState } from "react";
import StoryListItem from "~/components/StoryListItem";
import { Button } from "~/components/ui/button";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses } from "~/lib/styles";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Approved = () => {
  const approvedListQuery = api.story.getApprovedList.useQuery();

  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <header className="flex flex-1 justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl text-foreground">Approved list</h1>
          <p className="font-light text-muted-foreground">
            Your list of stories for which you have permission to read.
          </p>
        </div>

        <div className="flex h-10 w-full max-w-md gap-3">
          <TextInput
            placeholder="Search by keywords"
            icon={<FontAwesomeIcon icon={faSearch} />}
            value={query}
            classNames={mantineInputClasses}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />

          <Button variant="secondary">Import story</Button>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {approvedListQuery.data
          ?.filter(
            (item) => item.title.match(regex) || item.author.match(regex)
          )
          ?.map((item) => (
            <StoryListItem key={item.id} story={item} list="approved" />
          )) || null}
      </div>
    </WrapperWithNav>
  );
};

export default Approved;
