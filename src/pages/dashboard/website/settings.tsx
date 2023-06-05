import { Title } from "@mantine/core";
import React from "react";
import BodyWithLoader from "~/layouts/BodyWithLoader";
import WrapperWithNav from "~/layouts/WrapperWithNav";
import { websiteTabItems } from "~/routes";

const settings = () => {
  return (
    <WrapperWithNav tabs={websiteTabItems}>
      <BodyWithLoader
        isLoading={false}
        loadingMessage="Loading website settings..."
      >
        <Title className="h1 text-2xl">Settings</Title>
        <section className="mt-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-700">Danger zone</h2>
          <p className="font-thin text-gray-600">
            This action is permanent. This will delete your website forever.
          </p>
          <button className="button danger mt-4 ">Delete website</button>
        </section>
      </BodyWithLoader>
    </WrapperWithNav>
  );
};

export default settings;
