import { ColorPicker, NativeSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FormEvent, useEffect } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes, websiteTabItems } from "~/routes";
import { api } from "~/utils/api";

const themes = ["light", "dark"];

const Theme = () => {
  const saveTheme = api.website.saveTheme.useMutation();
  const websiteSettings = api.website.settings.useQuery();

  const form = useForm({
    initialValues: {
      theme: "light",
      colour: "rgba(0,0,0,0)",
    },
  });

  useEffect(() => {
    if (websiteSettings.data) {
      console.log(websiteSettings.data);

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

    saveTheme.mutate(form.values);
  };

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-10">
        <header>
          <TabsList tabs={websiteTabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex w-full max-w-sm flex-col">
          <h1 className="h1 text-2xl">Theme</h1>

          <form className="flex w-full flex-col gap-4" onSubmit={submitHandler}>
            <NativeSelect
              label="Mode"
              data={themes}
              {...form.getInputProps("theme")}
            />
            <div className="flex flex-col">
              <p className="label">Colour</p>
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
            <button type="submit" className="button main mt-4 w-full">
              Save changes
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default Theme;
