import {
  BadgeStylesNames,
  CheckboxStylesNames,
  ClassNames,
  DrawerStylesNames,
  ModalStylesNames,
  NumberInputStylesNames,
  PaginationStylesNames,
  SwitchStylesNames,
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
  input:
    "bg-input text-foreground placeholder:text-foreground/50 border-muted w-full rounded-md placeholder:italic px-3",
  wrapper: " box-border flex-1",
  label: "text-card-foreground",
  description: "text-muted-foreground",
  root: "flex-1",
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
  input: "bg-input text-foreground border-muted w-full rounded-md h-full",
  wrapper: "h-fit box-border",
  label: "text-card-foreground",
  description: "text-muted-foreground",
  controlUp: "bg-card text-card-foreground border-border ",
  controlDown: "bg-card text-card-foreground border-border",
  rightSection: "border-accent",
};

export const mantineBadgeClasses: Partial<Record<BadgeStylesNames, string>> = {
  root: "text-accent-foreground bg-accent",
};

export const mantineModalClasses: Partial<Record<ModalStylesNames, string>> = {
  header: "bg-background text-foreground",
  content: "bg-background rounded-3xl",
  body: "p-6",
  title: "py-6",
};

export const mantineSwitchStyles: Partial<Record<SwitchStylesNames, string>> = {
  label: "text-foreground",
  thumb: "bg-accent border-border",
  track: "bg-background border-border",
};

export const mantinePaginationStyles: ClassNames<PaginationStylesNames> = {
  control: "text-foreground bg-card border-border",
};

export const mantineDrawerClasses: Partial<Record<DrawerStylesNames, string>> =
  {
    content: "bg-background",
    header: "text-foreground bg-background",
  };
