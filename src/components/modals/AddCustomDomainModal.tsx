import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { api } from "~/utils/api";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

const AddCustomDomainModal = () => {
  const ctx = api.useUtils();
  const domain = api.website.addCustomDomain.useMutation({
    onSuccess: () => {
      ctx.website.settings.invalidate();
      toast.success("Domain added");
    },
  });
  const website = api.website.settings.useQuery();
  const [customDomain, setCustomDomain] = useState("");

  const save = () => {
    if (!website.data) return;

    domain.mutate({
      domain: customDomain,
      verified: false,
      websiteId: website.data?.id,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add custom domain</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add custom domain</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label>Domain</Label>
          <Input
            onChange={(e) => setCustomDomain(e.target.value)}
            value={customDomain}
            placeholder="example.com"
          />
        </div>

        <Button onClick={save}>Add</Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomDomainModal;
