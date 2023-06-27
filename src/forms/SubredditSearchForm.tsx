import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, TextInput } from "@mantine/core";
import { RecentlySearched } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { mantineInputClasses, mantineSelectClasses } from "~/lib/styles";

const categories = ["Hot", "New", "Rising", "Controversial", "Top"];

interface Props {
  open: () => void;
  searchHandler: (state: { subreddit: string; category: string }) => void;
  disableSearch: boolean;
  searches: RecentlySearched[] | undefined;
}

const SubredditSearchForm = ({
  open,
  searchHandler,
  disableSearch,
  searches,
}: Props) => {
  const [state, setState] = useState<{
    subreddit: string;
    category: string;
  }>({
    subreddit: "",
    category: "Hot",
  });

  return (
    <div className="flex w-full">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col p-3">
        <form
          className="flex w-full items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            searchHandler(state);
          }}
        >
          <TextInput
            variant="filled"
            placeholder="subreddit"
            icon="r/"
            className="flex-1"
            classNames={mantineInputClasses}
            onChange={(e) =>
              setState({ ...state, subreddit: e.currentTarget.value })
            }
            value={state.subreddit}
          />
          <Select
            defaultValue={categories[0]}
            data={categories}
            onChange={(e) => setState({ ...state, category: e as string })}
            classNames={mantineSelectClasses}
          />
          <Button type="button" variant="outline" onClick={open}>
            Add filters
          </Button>
          <Button type="submit" variant="default" disabled={disableSearch}>
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
          </Button>
        </form>
        {searches && (
          <ul className="mt-1 flex flex-wrap gap-6">
            {searches.map((s) => (
              <li key={s.text}>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => searchHandler({ ...state, subreddit: s.text })}
                >
                  {s.text}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SubredditSearchForm;
