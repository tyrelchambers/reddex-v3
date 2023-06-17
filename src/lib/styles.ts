import { BaseSelectStylesNames } from "@mantine/core/lib/Select/types";

export const mantineSelectClasses: Partial<
  Record<BaseSelectStylesNames, string>
> = {
  input: "bg-input text-foreground border-input hover:border-accent",
  dropdown: "bg-muted shadow-xl border-muted",
  item: "text-foreground hover:bg-accent hover:text-foreground active:bg-accent",
};
