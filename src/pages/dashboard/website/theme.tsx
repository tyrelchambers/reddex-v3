import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";
import { MixpanelEvents } from "~/types";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

const themes = ["light", "dark"];

const Theme = () => {
  const apiContext = api.useUtils();
  const saveTheme = api.website.saveTheme.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
      toast.success("Theme saved");
    },
  });
  const websiteSettings = api.website.settings.useQuery();

  const [colours, setColours] = useState({
    theme: "light",
    colour: "#ffffff",
  });

  useEffect(() => {
    if (websiteSettings.data) {
      setColours({
        theme: websiteSettings.data.theme,
        colour: websiteSettings.data.colour,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = () => {
    trackUiEvent(MixpanelEvents.SAVE_THEME_SETTINGS);

    saveTheme.mutate(colours);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={websiteSettings.isPending}
        loadingMessage="Loading website theme settings..."
      >
        <h1 className="text-2xl font-bold text-foreground">Theme</h1>
        <div className="my-6 flex gap-4">
          <Select
            value={colours.theme}
            onValueChange={(v) => setColours({ ...colours, theme: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="color"
            value={colours.colour}
            onChange={(v) => setColours({ ...colours, colour: v.target.value })}
            className="aspect-square w-12 p-0"
          />
        </div>
        <Button type="button" className="w-fit" onClick={submitHandler}>
          Save changes
        </Button>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default Theme;
