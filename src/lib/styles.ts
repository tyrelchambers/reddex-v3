import {
  BadgeStylesNames,
  CheckboxStylesNames,
  DividerStylesNames,
  NumberInputStylesNames,
  TextInputStylesNames,
} from "@mantine/core";
import { BaseSelectStylesNames } from "@mantine/core/lib/Select/types";

export const mantineSelectClasses: Partial<
  Record<BaseSelectStylesNames, string>
> = {
  input: "bg-input text-foreground border-input hover:border-accent",
  dropdown: "bg-muted shadow-xl border-muted",
  item: "text-foreground hover:bg-accent hover:text-foreground active:bg-accent",
  label: "text-foreground",
};

export const mantineInputClasses: Partial<
  Record<TextInputStylesNames, string>
> = {
  input: "bg-input text-foreground border-muted w-full rounded-md h-full p-3",
  wrapper: "h-fit box-border",
  label: "text-card-foreground",
  description: "text-muted-foreground",
};

export const mantineCheckBoxClasses: Partial<
  Record<CheckboxStylesNames, string>
> = {
  label: "text-card-foreground",
  description: "text-muted-foreground",
};

export const mantineNumberClasses: Partial<
  Record<NumberInputStylesNames, string>
> = {
  input: "bg-input text-foreground border-muted w-full rounded-md h-full p-3",
  wrapper: "h-fit box-border",
  label: "text-card-foreground",
  description: "text-muted-foreground",
  controlUp: "bg-card text-card-foreground border-muted-foreground ",
  controlDown: "bg-card text-card-foreground border-muted-foreground",
  rightSection: "border-accent",
};

export const mantineBadgeClasses: Partial<Record<BadgeStylesNames, string>> = {
  root: "text-foreground",
};
