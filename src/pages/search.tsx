import {
  Divider,
  Modal,
  NativeSelect,
  NumberInput,
  Switch,
  TextInput,
} from "@mantine/core";
import Head from "next/head";
import React, { useReducer } from "react";
import SubredditSearchForm from "~/forms/SubredditSearchForm";
import Header from "~/layouts/Header";
import { useDisclosure } from "@mantine/hooks";
import {
  type FilterAction,
  type FilterState,
  filterReducer,
} from "~/reducers/filterReducer";

interface FilterSelectionProps {
  filters: FilterState;
  dispatch: (data: FilterAction) => void;
}

const Search = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [filters, dispatch] = useReducer(filterReducer, {
    upvotes: {
      qualifier: "Over",
      value: 0,
    },
    readingTime: {
      qualifier: "Over",
      value: 0,
    },
    keywords: undefined,
    seriesOnly: false,
    excludeSeries: false,
  } as FilterState);

  console.log(filters);

  return (
    <>
      <Head>
        <title>Reddex | Search</title>
      </Head>
      <main>
        <Header />

        <div className="my-4 flex">
          <div className="mx-auto flex w-full max-w-screen-md items-end gap-3 rounded-xl bg-gray-50 p-4">
            <SubredditSearchForm open={open} />
          </div>

          {/* all posts */}
        </div>

        <Modal
          opened={opened}
          onClose={close}
          title="Add filters"
          classNames={{ title: "font-bold" }}
        >
          <p className="mb-4 text-sm text-gray-700">
            Any input that doesn&apos;t have a value, won&apos;t be applied.
          </p>
          <FilterSelections filters={filters} dispatch={dispatch} />
        </Modal>
      </main>
    </>
  );
};

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

export default Search;
