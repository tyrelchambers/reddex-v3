import { ColorPicker, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "~/components/ui/button";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { mantineSelectClasses } from "~/lib/styles";
import { websiteTabItems } from "~/routes";
import { useUserStore } from "~/stores/useUserStore";
import { MixpanelEvents } from "~/types";
import { hasProPlan } from "~/utils";
import { api } from "~/utils/api";
import { trackUiEvent } from "~/utils/mixpanelClient";

const themes = ["light", "dark"];

const Theme = () => {
  const apiContext = api.useContext();
  const userStore = useUserStore();
  const proPlan = hasProPlan(userStore.user?.subscription);
  const saveTheme = api.website.saveTheme.useMutation({
    onSuccess: () => {
      apiContext.website.invalidate();
      toast.success("Theme saved");
    },
  });
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm({
    initialValues: {
      theme: "light",
      colour: "rgba(0,0,0,0)",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      form.setValues({
        theme: websiteSettings.data.theme,
        colour: websiteSettings.data.colour,
      });
    }
  }, [websiteSettings.data]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    const { hasErrors } = form.validate();

    if (hasErrors) return;

    trackUiEvent(MixpanelEvents.SAVE_THEME_SETTINGS);
    saveTheme.mutate(form.values);
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

          <form className="form mt-4 max-w-sm " onSubmit={submitHandler}>
            <Select
              classNames={mantineSelectClasses}
              label="Mode"
              data={themes}
              {...form.getInputProps("theme")}
            />
            <div className="flex flex-col">
              <p className="label text-foreground">Colour</p>
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
                {...form.getInputProps("colour")}
              />
            </div>
            <Button type="submit" disabled={!proPlan}>
              Save changes
            </Button>
          </form>
        </BodyWithLoader>
      </main>
    </WrapperWithNav>
  );
};

export default Theme;
