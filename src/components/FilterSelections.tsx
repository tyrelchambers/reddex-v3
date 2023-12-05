import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { buildParams } from "~/utils";
import { useRouter } from "next/router";
import { FilterState } from "~/types";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/form";

interface FilterSelectionProps {
  filters: Partial<FilterState> | null;
}

const formSchema = z.object({
  upvotes: z.object({
    qualifier: z.string().optional(),
    value: z.string().optional().nullable(),
  }),
  readingTime: z.object({
    qualifier: z.string().optional(),
    value: z.string().optional().nullable(),
  }),
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

  // fix
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
        <div className="flex flex-col">
          <FormLabel>Upvotes</FormLabel>
          <div className="flex items-end gap-3">
            <FormField
              name="upvotes.qualifier"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-1 flex flex-col gap-2 md:flex-row">
                    <Select
                      {...field}
                      onValueChange={(v) => {
                        form.setValue("upvotes.qualifier", v);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue defaultValue="Over" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualifiers.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="upvotes.value"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Input className="flex-1" min={0} type="number" {...field} />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <FormLabel>Reading time in minutes</FormLabel>
          <div className="flex items-end gap-3">
            <FormField
              name="readingTime.qualifier"
              render={({ field }) => (
                <FormItem>
                  <div className="mt-1 flex flex-col gap-2 md:flex-row">
                    <Select {...field}>
                      <FormControl>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue defaultValue="Over" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {qualifiers.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              name="readingTime.value"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="flex- w-full"
                      min={0}
                      type="number"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

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
            <FormItem className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Series only</FormLabel>
                <FormDescription>
                  Specify whether or not you want to see only series&apos;
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="excludeSeries"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Exclude series</FormLabel>
                <FormDescription>
                  Select to exclude series from the results
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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
