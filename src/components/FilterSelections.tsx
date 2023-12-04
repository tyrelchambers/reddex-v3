import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { buildParams } from "~/utils";
import { useRouter } from "next/router";
import { FilterState } from "~/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem } from "./ui/select";
import { Switch } from "./ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";

interface FilterSelectionProps {
  filters: Partial<FilterState> | null;
}

const formSchema = z.object({
  upvotes: z
    .object({
      qualifier: z.string().optional(),
      value: z.union([z.string(), z.literal("")]).optional(),
    })
    .optional(),
  readingTime: z
    .object({
      qualifier: z.string().optional(),
      value: z.union([z.string(), z.literal("")]).optional(),
    })
    .optional(),
  keywords: z.string().optional(),
  seriesOnly: z.boolean().default(false),
  excludeSeries: z.boolean().default(false),
});

const FilterSelections = ({ filters }: FilterSelectionProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upvotes: {
        qualifier: "Over",
        value: "0",
      },
      readingTime: {
        qualifier: "Over",
        value: "0",
      },
      keywords: "",
      seriesOnly: false,
      excludeSeries: false,
    },
  });

  useEffect(() => {
    if (filters) {
      form.reset();
    }
  }, [filters]);

  const qualifiers = ["Over", "Under", "Equals"];

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    updateFilterValueFromUrl(data);
  };
  const updateFilterValueFromUrl = async (data: z.infer<typeof formSchema>) => {
    if (!data) return;

    const query = buildParams<Partial<z.infer<typeof formSchema>>>(data);

    await router.replace(router.asPath, {
      query,
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <FormField
          name="upvotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upvotes</FormLabel>
              <div className="mt-1 flex flex-col gap-2 md:flex-row">
                <Select
                  {...field}
                  onValueChange={(v) => {
                    form.setValue("upvotes.qualifier", v);
                  }}
                >
                  <SelectContent>
                    {qualifiers.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  min={0}
                  type="number"
                  {...field}
                  onChange={(v) => {
                    form.setValue("upvotes.value", v.target.value);
                  }}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="readingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reading time in minutes</FormLabel>
              <div className="mt-1 flex flex-col gap-2 md:flex-row">
                <Select
                  {...field}
                  onValueChange={(v) =>
                    form.setValue("readingTime.qualifier", v)
                  }
                >
                  <SelectContent>
                    {qualifiers.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  min={0}
                  type="number"
                  {...field}
                  onChange={(v) => {
                    form.setValue("readingTime.value", v.target.value);
                  }}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <Input
                className="mt-1"
                placeholder="Enter a comma separate list of keywords to search for"
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          name="seriesOnly"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Series only</FormLabel>
              <FormControl>
                <Switch checked={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="excludeSeries"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exclude series</FormLabel>
              <FormControl>
                <Switch checked={field.value} onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Apply filters</Button>
      </form>
    </Form>
  );
};

export default FilterSelections;
