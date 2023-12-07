import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecentlySearched } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const categories = ["Hot", "New", "Rising", "Controversial", "Top"];

interface Props {
  open: () => void;
  searchHandler: (state: { subreddit: string; category: string }) => void;
  disableSearch: boolean;
  searches: RecentlySearched[] | undefined;
}

const SubredditSearchForm = ({
  open,
  searchHandler,
  disableSearch,
  searches,
}: Props) => {
  const form = useForm({
    defaultValues: {
      subreddit: "",
      category: "Hot",
    },
  });
  const [state, setState] = useState<{
    subreddit: string;
    category: string;
  }>({
    subreddit: "",
    category: "Hot",
  });

  return (
    <div className="mt-8 flex flex-col">
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(searchHandler)}
        >
          <FormField
            name="subreddit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subreddit</FormLabel>
                <FormDescription>
                  Input just the name of the subreddit. For example: nosleep.
                </FormDescription>
                <Input placeholder="eg: nosleep, animals, puppies" {...field} />
              </FormItem>
            )}
          />

          <FormField
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue="Hot">
                  <SelectTrigger className="w-full text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="secondary"
            className="w-full "
            onClick={open}
          >
            Add filters
          </Button>
          <Button
            type="submit"
            variant="default"
            className="w-full "
            disabled={disableSearch}
          >
            {disableSearch ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                spin
                style={{
                  ["--fa-primary-color" as string]: "#fff",
                  ["--fa-secondary-color" as string]: "#1b3055",
                }}
              />
            ) : (
              "Search"
            )}
          </Button>
        </form>
      </Form>
      {searches && (
        <ul className="mt-1 flex flex-wrap gap-6">
          {searches.map((s) => (
            <li key={s.text}>
              <Button
                variant="link"
                size="sm"
                onClick={() => searchHandler({ ...state, subreddit: s.text })}
              >
                {s.text}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubredditSearchForm;
