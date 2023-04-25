import {
  faBrowser,
  faPalette,
  faPenNib,
  faPuzzlePiece,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TabsList from "~/components/TabsList";
import DashNav from "~/layouts/DashNav";
import Header from "~/layouts/Header";
import { routes } from "~/routes";

const tabItems = [
  {
    label: "General",
    slug: "general",
    icon: faBrowser,
  },
  {
    label: "Theme",
    slug: "theme",
    icon: faPalette,
  },
  {
    label: "Submission Form",
    slug: "submission-form",
    icon: faPenNib,
  },
  {
    label: "Integrations",
    slug: "integrations",
    icon: faPuzzlePiece,
  },
];

const Website = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && !router.query["tab"]) {
      router.push({
        pathname: router.asPath,
        query: "tab=general",
      });
    }
  }, [router.isReady]);

  return (
    <>
      <Header />
      <DashNav />
      <main className="mx-auto my-6 max-w-screen-2xl">
        <header>
          <TabsList tabs={tabItems} route={routes.WEBSITE} />
        </header>

        <section className="flex"></section>
      </main>
    </>
  );
};

export default Website;
