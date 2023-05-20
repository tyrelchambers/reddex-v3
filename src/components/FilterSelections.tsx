import { NativeSelect, NumberInput, TextInput, Switch } from "@mantine/core";
import React from "react";
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
        <p className="text-sm ">Upvotes</p>
        <div className="mt-1 flex gap-2">
          <NativeSelect
            data={qualifiers}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "upvotes",
                payload: { qualifier: e.currentTarget.value },
              })
            }
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
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
        <p className="text-sm ">Reading time in minutes</p>
        <div className="mt-1 flex gap-2">
          <NativeSelect
            data={qualifiers}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_FILTER",
                filter: "readingTime",
                payload: { qualifier: e.currentTarget.value },
              })
            }
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
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
        <p className="text-sm ">Keywords</p>
        <TextInput
          variant="filled"
          className="mt-1"
          placeholder="Enter a comma separate list of keywords to search for"
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
      />
      <Switch
        label="Exclude series"
        onChange={(e) =>
          dispatch({ type: "EXCLUDE_SERIES", payload: e.currentTarget.checked })
        }
      />

      <button type="button" className="button main mt-4 w-full">
        Apply filters
      </button>
    </section>
  );
};

export default FilterSelections;
