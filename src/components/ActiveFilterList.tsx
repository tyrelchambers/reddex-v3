import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "@mantine/core";
import React from "react";
import { mantineBadgeClasses } from "~/lib/styles";
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
    <div className="flex justify-between">
      <div className="bg-card-background mb-4 flex flex-col gap-1">
        <ul className="flex gap-3">
          {activeFilters(filters).map((filter) => (
            <li
              key={filter.label}
              className="flex w-fit cursor-pointer items-center gap-2  p-1"
              onClick={() => removeFilter(filter)}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-card p-1 text-card-foreground">
                <FontAwesomeIcon icon={faTimes} />
              </span>
              <Badge classNames={mantineBadgeClasses}>{filter.label}</Badge>
            </li>
          ))}
        </ul>
      </div>

      {Object.keys(filters).length > 0 && (
        <Button variant="outline" onClick={reset}>
          Reset filters
        </Button>
      )}
    </div>
  );
};

export default ActiveFilterList;
