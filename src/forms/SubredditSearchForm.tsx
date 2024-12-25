import { faSpinnerThird } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useSession } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FilterSelections from "~/components/FilterSelections";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { useSearchStore } from "~/stores/searchStore";
import { MixpanelEvents } from "~/types";
import { addLastSearchedOrUpdate } from "~/utils";
import { api } from "~/utils/api";
import { db } from "~/utils/dexie";
import { trackUiEvent } from "~/utils/mixpanelClient";

const categories = ["Hot", "New", "Rising", "Controversial", "Top"];

const formSchema = z.object({
  subreddit: z.string(),
  category: z.string(),
});

const SubredditSearchForm = () => {
  const [filterModalOpen, setFilterModalOpen] = React.useState(false);

  const { setIsSearching, setPage } = useSearchStore();
  const statsUpdate = api.stats.set.useMutation();

  const subredditSearch = api.subredditSearch.search.useMutation({
    async onSuccess(data) {
      await db.posts.clear();
      await db.posts.bulkAdd(data);
      await addLastSearchedOrUpdate();
      // TODO; move to server
      statsUpdate.mutate(data.length);
      setIsSearching(false);
    },
  });
  const session = useSession();

  const currentUser = api.user.me.useQuery(undefined, {
    enabled: session.status === "authenticated",
  });
  const searches = currentUser.data?.Profile?.searches;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subreddit: "",
      category: "Hot",
    },
  });

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    searchHandler(data);
  };

  const recentSearchHandler = (subreddit: string) => {
    searchHandler({
      subreddit,
      category: "Hot",
    });
  };

  const searchHandler = ({
    subreddit,
    category,
  }: {
    subreddit: string;
    category: string;
  }) => {
    if (!subreddit) return;

    const s = subreddit
      .replace("r/", "")
      .replaceAll(" ", "")
      .trim()
      .toLocaleLowerCase();

    const payload = {
      subreddit,
      category,
    };

    trackUiEvent(MixpanelEvents.SUBREDDIT_SEARCH, {
      subreddit: s,
    });

    subredditSearch.mutate(payload);
    setIsSearching(true);
    setPage(1);
  };

  return (
    <div className="mt-8 flex flex-col">
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(submitHandler)}
        >
          <FormField
            name="subreddit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subreddit</FormLabel>
                <FormDescription>
                  Input just the name of the subreddit. For example: nosleep.
                </FormDescription>
                <div className="flex">
                  <p className="mr-2 flex aspect-square h-10 w-10 items-center justify-center rounded-lg bg-card font-bold uppercase text-card-foreground">
                    r <span className="text-sm">/</span>
                  </p>
                  <Input
                    placeholder="eg: nosleep, animals, puppies"
                    {...field}
                  />
                </div>
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

          <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="secondary" className="w-full">
                Add filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apply filters</DialogTitle>
              </DialogHeader>
              <p className="mb-4 text-sm text-foreground/60">
                Any input that doesn&apos;t have a value, won&apos;t be applied.
              </p>
              <FilterSelections closeModal={() => setFilterModalOpen(false)} />
            </DialogContent>
          </Dialog>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={subredditSearch.isPending}
          >
            {subredditSearch.isPending ? (
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
                onClick={() => recentSearchHandler(s.text)}
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
