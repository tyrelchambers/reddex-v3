import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Props {
  setSearch: (value: string) => void;
  resetSearch: () => void;
  search: string;
}

const InboxHeaderTablet = ({ search, setSearch, resetSearch }: Props) => {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4">
      <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
      <div className="flex w-full gap-4 xl:flex-col">
        <Input
          placeholder="Search for a message via author or subject"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="flex w-full flex-1"
        />
        <Button
          variant="secondary"
          className="flex-grow-0"
          onClick={resetSearch}
        >
          Reset
        </Button>
      </div>
    </header>
  );
};

export default InboxHeaderTablet;
