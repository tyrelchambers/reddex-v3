import {
  faInboxIn,
  faRectangleHistory,
  faRectangleList,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ApprovedStoriesList from "~/components/ApprovedStoriesList";
import CompletedStoriesList from "~/components/CompletedStoriesList";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes } from "~/routes";

const nav = [
  {
    label: "Approved",
    slug: "approved",
    icon: faRectangleHistory,
  },
  {
    label: "Completed",
    slug: "completed",
    icon: faRectangleList,
  },
  {
    label: "Submitted",
    slug: "submitted",
    icon: faInboxIn,
  },
];

const Stories = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && !router.query["tab"]) {
      router.push({
        pathname: router.asPath,
        query: "tab=approved",
      });
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 flex max-w-screen-2xl gap-14">
        <header>
          <TabsList tabs={nav} route={routes.STORIES} />
        </header>

        <section className="flex-1">
          {router.query["tab"] === "approved" && <ApprovedStoriesList />}
          {router.query["tab"] === "completed" && <CompletedStoriesList />}
        </section>
      </main>
    </>
  );
};

export default Stories;
