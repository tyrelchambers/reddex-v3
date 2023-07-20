import { NumberInput, TextInput, Switch, Select } from "@mantine/core";
import React, { FormEvent, useEffect } from "react";
import {
  mantineInputClasses,
  mantineNumberClasses,
  mantineSelectClasses,
  mantineSwitchStyles,
} from "~/lib/styles";
import { Button } from "./ui/button";
import { buildParams } from "~/utils";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { FilterState } from "~/types";

interface FilterSelectionProps {
  filters: Partial<FilterState> | null;
}

export interface FormProps {
  upvotes?: {
    qualifier: string | undefined | null;
    value: number | undefined | null;
  };
  readingTime?: {
    qualifier: string | undefined | null;
    value: number | undefined | null;
  };
  keywords: string | undefined | null;
  seriesOnly: boolean | undefined | null;
  excludeSeries: boolean | undefined | null;
}

const FilterSelections = ({ filters }: FilterSelectionProps) => {
  const router = useRouter();
  const form = useForm<FormProps>({
    initialValues: {
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
    },
  });

  useEffect(() => {
    if (filters) {
      form.setValues({
        upvotes: {
          qualifier: filters.upvotes?.qualifier || "Over",
          value: Number(filters.upvotes?.value) || undefined,
        },
        readingTime: {
          qualifier: filters.readingTime?.qualifier || "Over",
          value: Number(filters.readingTime?.value) || undefined,
        },
        excludeSeries: Boolean(filters.excludeSeries),
        keywords: filters.keywords,
        seriesOnly: Boolean(filters.seriesOnly),
      });
    }
  }, [filters]);

  const qualifiers = ["Over", "Under", "Equals"];

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    updateFilterValueFromUrl(form.values);
  };
  const updateFilterValueFromUrl = async (appliedFilters: FormProps | null) => {
    if (!appliedFilters) return;

    const query = buildParams<Partial<FormProps>>(appliedFilters);

    await router.replace(router.asPath, {
      query,
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={submitHandler}>
      <div className="flex flex-col">
        <p className="text-sm text-foreground">Upvotes</p>
        <div className="mt-1 flex gap-2">
          <Select
            data={qualifiers}
            classNames={mantineSelectClasses}
            {...form.getInputProps("upvotes.qualifier")}
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
            classNames={mantineNumberClasses}
            {...form.getInputProps("upvotes.value")}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <p className="text-sm text-foreground">Reading time in minutes</p>
        <div className="mt-1 flex h-8 gap-2">
          <Select
            data={qualifiers}
            classNames={mantineSelectClasses}
            {...form.getInputProps("readingTime.qualifier")}
          />{" "}
          <NumberInput
            className="flex-1"
            min={0}
            classNames={mantineNumberClasses}
            {...form.getInputProps("readingTime.value")}
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
          {...form.getInputProps("keywords")}
        />
      </div>

      <Switch
        label="Series only"
        classNames={mantineSwitchStyles}
        {...form.getInputProps("seriesOnly", {
          type: "checkbox",
        })}
      />
      <Switch
        label="Exclude series"
        classNames={mantineSwitchStyles}
        {...form.getInputProps("excludeSeries", {
          type: "checkbox",
        })}
      />

      <Button type="submit">Apply filters</Button>
    </form>
  );
};

export default FilterSelections;
