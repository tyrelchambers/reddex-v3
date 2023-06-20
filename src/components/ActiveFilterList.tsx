import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@mantine/core";
import React from "react";
import { mantineBadgeClasses } from "~/lib/styles";
import { FilterState } from "~/reducers/filterReducer";
import { activeFilters } from "~/utils/activeFilters";
import { Button } from "./ui/button";

interface Props {
  filters: FilterState | null;
  removeFilter: (filter: string) => void;
  reset: () => void;
}
const ActiveFilterList = ({ filters, removeFilter, reset }: Props) => {
  return (
    <div className="flex justify-between">
      <div className="bg-card-background mb-4 flex flex-col gap-1">
        <ul className="flex gap-3">
          {activeFilters(filters).map((filter) => (
            <li
              key={filter}
              className="flex w-fit cursor-pointer items-center gap-2 rounded-full border-[1px] border-border p-1"
              onClick={() => removeFilter(filter)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card p-1 text-card-foreground">
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <Badge classNames={mantineBadgeClasses}>{filter}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <Button variant="outline" onClick={reset}>
        Reset filters
      </Button>
    </div>
  );
};

export default ActiveFilterList;
