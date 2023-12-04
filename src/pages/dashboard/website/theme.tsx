import { zodResolver } from "@hookform/resolvers/zod";
import { ColorPicker } from "@mantine/core";
import React, { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem } from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineSelectClasses } from "~/lib/styles";
import { websiteTabItems } from "~/routes";
import { websiteThemeSchema } from "~/server/schemas";
import { MixpanelEvents } from "~/types";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const themes = ["light", "dark"];

const formSchema = websiteThemeSchema;

const Theme = () => {
  const apiContext = api.useUtils();
  const { data: user } = api.user.me.useQuery();
  const proPlan = hasProPlan(user?.subscription);
  const saveTheme = api.website.saveTheme.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
      toast.success("Theme saved");
    },
  });
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "light",
      colour: "rgba(0,0,0,0)",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.reset({
        theme: websiteSettings.data.theme,
        colour: websiteSettings.data.colour,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    trackUiEvent(MixpanelEvents.SAVE_THEME_SETTINGS);
    console.log(data);

    // saveTheme.mutate(data);
  };

  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <main className="my-6 flex w-full max-w-screen-2xl gap-10">
        <BodyWithLoader
          isLoading={websiteSettings.isLoading}
          loadingMessage="Loading website theme settings..."
          hasProPlan={proPlan}
        >
          <h1 className="text-2xl text-foreground">Theme</h1>

          <Form {...form}>
            <form
              className="form mt-4 max-w-sm "
              onSubmit={form.handleSubmit(submitHandler)}
            >
              <FormField
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <Select {...field}>
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
                  </FormItem>
                )}
              />
              <FormField
                name="colour"
                render={({ field }) => (
                  <FormItem>
                    <ColorPicker
                      format="rgba"
                      swatches={[
                        "#25262b",
                        "#868e96",
                        "#fa5252",
                        "#e64980",
                        "#be4bdb",
                        "#7950f2",
                        "#4c6ef5",
                        "#228be6",
                        "#15aabf",
                        "#12b886",
                        "#40c057",
                        "#82c91e",
                        "#fab005",
                        "#fd7e14",
                      ]}
                      className="w-full"
                      {...field}
                    />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!proPlan}>
                Save changes
              </Button>
            </form>
          </Form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default Theme;
