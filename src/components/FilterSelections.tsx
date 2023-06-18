import { NumberInput, TextInput, Switch, Select } from "@mantine/core";
import React from "react";
import {
  mantineInputClasses,
  mantineNumberClasses,
  mantineSelectClasses,
  mantineSwitchStyles,
} from "~/lib/styles";
import { FilterState, FilterAction } from "~/reducers/filterReducer";

interface FilterSelectionProps {
  filters: FilterState;
  dispatch: (data: FilterAction) => void;
}

const FilterSelections = ({ filters, dispatch }: FilterSelectionProps) => {
  const qualifiers = ["Over", "Under", "Equals"];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <p className="text-sm text-foreground">Upvotes</p>
        <div className="mt-1 flex gap-2">
          <Select
            data={qualifiers}
            classNames={mantineSelectClasses}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "upvotes",
                payload: { qualifier: e },
              })
            }
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
            classNames={mantineNumberClasses}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "upvotes",
                payload: { value: Number(e) },
              })
            }
            value={Number(filters.upvotes.value || 0)}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-foreground">Reading time in minutes</p>
        <div className="mt-1 flex h-8 gap-2">
          <Select
            data={qualifiers}
            classNames={mantineSelectClasses}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "readingTime",
                payload: { qualifier: e },
              })
            }
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
            classNames={mantineNumberClasses}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "readingTime",
                payload: { value: Number(e) },
              })
            }
            value={Number(filters.readingTime.value || 0)}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-foreground">Keywords</p>
        <TextInput
          variant="filled"
          className="mt-1"
          placeholder="Enter a comma separate list of keywords to search for"
          classNames={mantineInputClasses}
          onChange={(e) =>
            dispatch({ type: "KEYWORDS", payload: e.currentTarget.value })
          }
          defaultValue={filters.keywords}
        />
      </div>

      <Switch
        label="Series only"
        onChange={(e) =>
          dispatch({ type: "SERIES_ONLY", payload: e.currentTarget.checked })
        }
        classNames={mantineSwitchStyles}
      />
      <Switch
        label="Exclude series"
        onChange={(e) =>
          dispatch({ type: "EXCLUDE_SERIES", payload: e.currentTarget.checked })
        }
        classNames={mantineSwitchStyles}
      />

      <button type="button" className="button main mt-4 w-full">
        Apply filters
      </button>
    </section>
  );
};

export default FilterSelections;
