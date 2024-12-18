import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "./ui/button";
import { activeFilters } from "~/utils";
import { FilterState } from "~/types";

interface Props {
  filters: Partial<FilterState>;
  removeFilter: (filter: { label: string; value: string }) => void;
  reset: () => void;
}
const ActiveFilterList = ({ filters, removeFilter, reset }: Props) => {
  return (
    <div className="flex items-center">
      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="mr-4 flex-none"
          onClick={reset}
        >
          Reset filters
        </Button>
      )}

      <div className="bg-card-background flex flex-col gap-1">
        <ul className="flex gap-3">
          {activeFilters(filters).map((filter) => (
            <li
              key={filter.label}
              className="flex w-fit cursor-pointer items-center gap-2 rounded-full bg-primary p-1 text-sm"
              onClick={() => removeFilter(filter)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card/40 p-1 text-card-foreground">
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <p className="mr-3 font-medium text-primary-foreground">
                {filter.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActiveFilterList;
