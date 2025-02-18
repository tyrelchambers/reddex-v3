import { Top3 as ITop3 } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";

type OmittedTop3 = Omit<ITop3, "id" | "websiteId">;

const LinkComp = ({
  index,
  value,
  setState,
}: {
  index: number;
  value: OmittedTop3;
  setState: (p: OmittedTop3) => void;
}) => (
  <div className="not-last:border-border flex flex-col gap-4 py-6 not-last:border-b first:pt-0">
    <Label>Top #{index}</Label>

    <div className="flex flex-col">
      <Label>Label</Label>
      <p className="text-muted-foreground mb-2 text-sm">
        Label your highlight. Useful for non-video types.
      </p>
      <Input
        placeholder="Label"
        value={value.label}
        onChange={(e) => setState({ ...value, label: e.target.value })}
      />
    </div>

    <Input
      placeholder="https://"
      value={value.url}
      onChange={(e) => setState({ ...value, url: e.target.value })}
    />
    <div>
      <Label>Link type</Label>
      <p className="text-muted-foreground mb-2 text-sm">
        Select a video type of the link you are including is a Youtube video for
        example.
      </p>
      <Select
        defaultValue="webpage"
        value={value.type}
        onValueChange={(v) => setState({ ...value, type: v })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webpage">Webpage</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const Top3 = () => {
  const initialData = {
    top1: {
      index: 1,
      url: "",
      label: "",
      type: "webpage",
    },
    top2: {
      index: 2,
      url: "",
      label: "",
      type: "webpage",
    },
    top3: {
      index: 3,
      url: "",
      label: "",
      type: "webpage",
    },
  };

  const updateTop3 = api.website.updateTop3.useMutation({
    onSuccess: () => {
      toast.success("Top 3 saved");
    },
    onError: () => {
      toast.error("Error saving top 3");
    },
  });
  const website = api.website.settings.useQuery();
  const [state, setState] = useState<{
    top1: OmittedTop3;
    top2: OmittedTop3;
    top3: OmittedTop3;
  }>(initialData);

  useEffect(() => {
    if (website.data) {
      const data: {
        top1: OmittedTop3;
        top2: OmittedTop3;
        top3: OmittedTop3;
      } = initialData;

      for (let index = 0; index < website.data.top3.length; index++) {
        const element = website.data.top3[index];
        if (!element) continue;

        if (element.index === 1) {
          data["top1"] = element;
        } else if (element.index === 2) {
          data["top2"] = element;
        } else if (element.index === 3) {
          data["top3"] = element;
        }
      }

      setState(data);
    }
  }, [website.data]);

  const submitHandler = () => {
    updateTop3.mutate({
      websiteId: website.data?.id,
      data: Object.values(state),
    });
  };

  return (
    <form>
      <LinkComp
        index={1}
        value={state.top1}
        setState={(p) => setState({ ...state, top1: p })}
      />
      <LinkComp
        index={2}
        value={state.top2}
        setState={(p) => setState({ ...state, top2: p })}
      />
      <LinkComp
        index={3}
        value={state.top3}
        setState={(p) => setState({ ...state, top3: p })}
      />

      <Button className="mt-4 w-full" type="button" onClick={submitHandler}>
        Save
      </Button>
    </form>
  );
};

export default Top3;
