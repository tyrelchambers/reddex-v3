import React from "react";
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

const LinkComp = ({ index }: { index: number }) => (
  <div className="not-last:border-border py-6 not-last:border-b first:pt-0">
    <Label>Link #{index}</Label>
    <p className="text-muted-foreground mb-2 text-sm">
      The link you&apos;d like to send people to.
    </p>
    <Input placeholder="https://" className="mb-2" />
    <div>
      <Label>Link type</Label>
      <p className="text-muted-foreground mb-2 text-sm">
        Select a video type of the link you are including is a Youtube video for
        example.
      </p>
      <Select defaultValue="text">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>{" "}
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

const LinkList = () => {
  const els = [];

  for (let i = 1; i <= 6; i++) {
    els.push(<LinkComp key={i} index={i} />);
  }

  return <div className="flex flex-col">{els}</div>;
};

const Top6 = () => {
  return (
    <form>
      <LinkList />

      <Button className="mt-4 w-full">Save</Button>
    </form>
  );
};

export default Top6;
