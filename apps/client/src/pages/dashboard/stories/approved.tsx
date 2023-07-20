import { faSearch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import StoryListItem from "~/components/StoryListItem";
import { Button } from "~/components/ui/button";
import ImportStoryForm from "~/forms/ImportStoryForm";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineInputClasses, mantineModalClasses } from "~/lib/styles";
import { storiesTabs } from "~/routes";
import { api } from "~/utils/api";

const Approved = () => {
  const approvedListQuery = api.story.getApprovedList.useQuery();
  const [opened, { open, close }] = useDisclosure(false);

  const [query, setQuery] = useState("");
  const regex = new RegExp(query, "gi");

  return (
    <WrapperWithNav tabs={storiesTabs}>
      <header className="flex flex-1 flex-col justify-between px-4 lg:px-0 xl:flex-row">
        <div className="mb-6 flex flex-col lg:mb-0">
          <h1 className="text-2xl text-foreground">Approved list</h1>
          <p className="font-light text-muted-foreground">
            Your list of stories for which you have permission to read.
          </p>
        </div>

        <div className="flex w-full max-w-md flex-col gap-3 lg:flex-row">
          <TextInput
            placeholder="Search by keywords"
            icon={<FontAwesomeIcon icon={faSearch} />}
            value={query}
            classNames={mantineInputClasses}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />

          <Button variant="secondary" onClick={open}>
            Import story
          </Button>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {approvedListQuery.data
          ?.filter(
            (item) => item.title.match(regex) || item.author.match(regex)
          )
          ?.map((item) => (
            <StoryListItem key={item.id} story={item} list="approved" />
          )) || null}
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Import story"
        classNames={mantineModalClasses}
      >
        <ImportStoryForm />
      </Modal>
    </WrapperWithNav>
  );
};

export default Approved;
