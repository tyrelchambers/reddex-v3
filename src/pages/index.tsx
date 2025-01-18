import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/layouts/Header";
import Footer from "~/layouts/Footer";

import DownArrow from "../../public/images/undraw_dashed-arrow.svg";

import UsedBy from "~/layouts/Index/UsedBy";
import Stats from "~/layouts/Index/Stats";
import Hero from "~/layouts/Index/Hero";
import Testimonials from "~/layouts/Index/Testimonials";
import Features from "~/layouts/Index/Features";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Reddex</title>
        <meta
          name="description"
          content="Helping YouTube narrators find the best stories."
        />
      </Head>
      <Header />
      <main className="mx-auto max-w-screen-2xl">
        <div className="mt-20 flex flex-col gap-36">
          <Hero />
          <UsedBy />
          <span className="mx-auto">
            <DownArrow id="down-arrow" />
          </span>
          <Testimonials />
          <Stats />
        </div>
        <Features />
      </main>
      <Footer />
    </>
  );
};

export default Home;
