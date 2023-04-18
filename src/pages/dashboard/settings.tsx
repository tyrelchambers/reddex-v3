import { NumberInput } from "@mantine/core";
import React from "react";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";

const settings = () => {
  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <h1 className="h1 text-2xl">Settings</h1>

        <section className="flex flex-col gap-10">
          <div className="flex flex-col">
            <h2>Profile</h2>

            <div className="flex flex-col">
              <NumberInput
                label="Words per minute"
                description="This will help better calculate the time it takes to read a
                story."
              />
              <button className="button main mt-3">Save changes</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default settings;
