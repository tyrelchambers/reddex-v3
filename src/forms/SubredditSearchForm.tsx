import { NativeSelect, TextInput } from "@mantine/core";
import React, { FormEvent } from "react";

const categories = ["Hot", "New", "Rising", "Controversial", "Top"];

interface Props {
  open: () => void;
}

const SubredditSearchForm = ({ open }: Props) => {
  const searchHandler = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <form className="flex w-full items-end gap-3" onSubmit={searchHandler}>
      <TextInput label="Subreddit" placeholder="subreddit" icon="r/" />
      <NativeSelect label="Category" data={categories} />
      <button
        type="button"
        className="button third  flex-1 whitespace-nowrap"
        onClick={open}
      >
        Add filters
      </button>
      <button type="submit" className="button main  flex-1 whitespace-nowrap">
        Search
      </button>
    </form>
  );
};

export default SubredditSearchForm;
