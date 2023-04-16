import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NativeSelect, TextInput } from "@mantine/core";
import React, { useState } from "react";

const categories = ["Hot", "New", "Rising", "Controversial", "Top"];

interface Props {
  open: () => void;
  searchHandler: (state: { subreddit: string; category: string }) => void;
  disableSearch: boolean;
}

const SubredditSearchForm = ({ open, searchHandler, disableSearch }: Props) => {
  const [state, setState] = useState({
    subreddit: "",
    category: "Hot",
  });

  return (
    <form
      className="flex w-full max-w-screen-lg items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        searchHandler(state);
      }}
    >
      <TextInput
        placeholder="subreddit"
        icon="r/"
        className="flex-1"
        onChange={(e) =>
          setState({ ...state, subreddit: e.currentTarget.value })
        }
        value={state.subreddit}
      />
      <NativeSelect
        data={categories}
        onChange={(e) =>
          setState({ ...state, category: e.currentTarget.value })
        }
      />
      <button
        type="button"
        className="button third  whitespace-nowrap"
        onClick={open}
      >
        Add filters
      </button>
      <button
        type="submit"
        className="button main  whitespace-nowrap"
        disabled={disableSearch}
      >
        {disableSearch ? (
          <FontAwesomeIcon
            icon={faSpinnerThird}
            spin
            style={{
              "--fa-primary-color": "#fff",
              "--fa-secondary-color": "#1b3055",
            }}
          />
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};

export default SubredditSearchForm;
