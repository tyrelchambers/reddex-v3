import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecentlySearched } from "@prisma/client";
import { Portal } from "@radix-ui/react-popover";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
    <div className="mt-8 flex flex-col">
      <form
        className="flex w-full flex-col items-end gap-3 "
        onSubmit={(e) => {
          e.preventDefault();
          searchHandler(state);
        }}
      >
        <Input
          placeholder="r/subreddit"
          className="w-full flex-1"
          onChange={(e) =>
            setState({ ...state, subreddit: e.currentTarget.value })
          }
          value={state.subreddit}
        />

        <Select
          onValueChange={(e) => setState({ ...state, category: e })}
          defaultValue="Hot"
        >
          <SelectTrigger className="w-full text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="secondary"
          className="w-full "
          onClick={open}
        >
          Add filters
        </Button>
        <Button
          type="submit"
          variant="default"
          className="w-full "
          disabled={disableSearch}
        >
          {disableSearch ? (
            <FontAwesomeIcon
              icon={faSpinnerThird}
              spin
              style={{
                ["--fa-primary-color" as string]: "#fff",
                ["--fa-secondary-color" as string]: "#1b3055",
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
  );
};

export default SubredditSearchForm;
