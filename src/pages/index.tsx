/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/layouts/Header";
import { Avatar, Badge } from "@mantine/core";
import { mantineBadgeClasses } from "~/lib/styles";
import { api } from "~/utils/api";
import Footer from "~/layouts/Footer";
import { useState } from "react";
import ATRDLogo from "../../public/images/ravendreams.jpeg";
import ContactIcon from "../../public/images/monitor_illustration_2.svg";
import Monitor from "../../public/images/monitor_illustration.svg";
import ReadingList from "../../public/images/colorful_icon_2.svg";
import InboxFilter from "../../public/images/colorful_icon_7.svg";
import SavedMessage from "../../public/images/ecommerce_icons_1.svg";
import TagIcon from "../../public/images/organization_icons_4.svg";
import ContactList from "../../public/images/random_icons_6.svg";
import StorySubmission from "../../public/images/seo_icons_6.svg";
import GuyWithGlasses from "../../public/images/guy_with_glasses.svg";
import HeroImg from "../../public/images/hero_illustration.svg";
import Squiggly from "../../public/images/undraw_fun-underline.svg";
import DownArrow from "../../public/images/undraw_dashed-arrow.svg";

import Link from "next/link";
import { routes } from "~/routes";

const Home: NextPage = () => {
  const statsQuery = api.stats.get.useQuery();
  return (
    <>
      <Head>
        <title>Reddex</title>
        <meta
          name="description"
          content="Helping YouTube narrators find the best stories."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto max-w-screen-2xl">
        <Header />

        <div className="mt-20 flex flex-col gap-36">
          <Hero />
          <UsedBy />
          <span className="mx-auto">
            <DownArrow id="down-arrow" />
          </span>
          <Testimonials />
          {statsQuery.data && <Stats stats={statsQuery.data} />}
        </div>
        <Features />
      </main>
      <Footer />
    </>
  );
};

const UsedBy = () => {
  const usedBy = [
    "Mr.CreepyPasta",
    "AsTheRavenDreams",
    "Stories After Midnight",
    "TheDarkNarrator",
    "To_42",
    "TheOminousDarkness",
    "Margbot",
    "GothicRose",
    "OriginalGensen",
    "Dead Leaf Clover",
  ];

  return (
    <section className="mx-2 xl:mx-0">
      <p className="text-center font-bold text-muted-foreground">
        Trusted by these great narrators
      </p>

      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {usedBy.map((u) => (
          <li
            key={u}
            className="text-xl font-black text-foreground xl:text-3xl"
          >
            {u}
          </li>
        ))}
      </ul>
    </section>
  );
};

interface Props {
  stats: {
    users: number;
    posts: number | undefined;
    stories: number;
  };
}

const Stats = ({ stats }: Props) => {
  const _stats = [
    {
      data: stats.users,
      desc: "Narrators using Reddex",
    },
    {
      data: stats.posts,
      desc: "Total search results",
    },
    {
      data: stats.stories,
      desc: "Stories submitted to narrators",
    },
  ];
  return (
    <section className="relative mx-2 rounded-xl bg-gray-900 py-28 xl:mx-0">
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="max-w-2xl lg:mx-auto lg:text-center">
          <h3 className="text-3xl font-semibold text-white sm:text-4xl">
            Narrators love Reddex!
          </h3>
          <p className="mt-3 text-gray-300">
            Seriously, Reddex can save you a boat load of time and gives you a
            ton of cool features
          </p>
        </div>
        <div className="mt-12">
          <ul className="flex-wrap items-start gap-x-12 gap-y-10 space-y-8 sm:flex sm:space-y-0 lg:justify-center">
            {_stats.map((item, idx) => (
              <li key={idx} className="sm:max-w-[15rem]">
                <h4 className="text-4xl font-semibold text-white">
                  {item.data}
                </h4>
                <p className="mt-3 font-medium text-gray-400">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="absolute inset-0 mx-auto h-80 max-w-md blur-[118px] sm:h-72"
        style={{
          background:
            "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
        }}
      ></div>
    </section>
  );
};

const Hero = () => (
  <section className="hero flex w-full max-w-screen-md  flex-col items-center justify-center gap-10 px-2 md:mx-auto">
    <Badge className="w-fit" classNames={mantineBadgeClasses} color="rose">
      Thousands of stories read
    </Badge>
    <div className="relative">
      <h1 className="text-center text-5xl font-semibold text-foreground">
        We help Narrators like you save time and effort
      </h1>
      <span className="absolute right-[11%] ">
        <Squiggly id="svg-squig" />
      </span>
    </div>
    <p className="relative z-10 mt-4 text-center text-2xl font-thin text-muted-foreground">
      Reddex is a tool designed to help you find the next best Reddit story in
      no-time at all. Save hours searching for stories and requesting
      permission. Reddex helps you do all that in a matter of minutes.
    </p>

    <div className="cta-bg-parent relative h-fit w-full max-w-md">
      <div id="cta-bg"></div>
      <Link
        href={routes.SEARCH}
        className="search-cta absolute z-10 flex w-full justify-center rounded-xl bg-gradient-to-tr from-purple-400 to-pink-400 px-8 py-3 font-bold text-background shadow-xl"
      >
        Start searching
      </Link>
    </div>
  </section>
);

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      avatar: ATRDLogo.src,
      name: "As The Raven Dreams",
      quote:
        "IF you are one of the many people who pulls stories from reddit- you NEED to check out Reddex.app. It is SERIOUSLY the quickest and easiest manner to get a lot of stories, and with the 'time to read' feature, you can filter out the shorter stories with ease.",
    },
    {
      name: "Dead Leaf Clover",
      quote: `Thanks to the endlessly awesome site that is @ReddexApp. I definitely recommend checking out reddex, there are always awesome new features being added.`,
    },
  ];
  return (
    <section className="py-4 xl:py-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h3 className="pb-6 font-semibold text-accent">
            What people are saying
          </h3>
          <ul>
            {testimonials.map((item, idx) =>
              currentTestimonial == idx ? (
                <li key={idx}>
                  <figure>
                    <blockquote>
                      <p className="text-xl font-semibold text-foreground/70 sm:text-2xl">
                        “{item.quote}“
                      </p>
                    </blockquote>
                    <div className="mt-6">
                      <Avatar
                        src={item?.avatar || undefined}
                        className="mx-auto h-16 w-16 rounded-full"
                      />
                      <div className="mt-3">
                        <span className="block font-semibold text-foreground">
                          {item.name}
                        </span>
                      </div>
                    </div>
                  </figure>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <div className="mt-6">
          <ul className="flex justify-center gap-x-3">
            {testimonials.map((item, idx) => (
              <li key={idx}>
                <button
                  className={`h-2.5 w-2.5 rounded-full ring-indigo-600 ring-offset-2 duration-150 focus:ring ${
                    currentTestimonial == idx ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(idx)}
                ></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="mx-auto max-w-screen-lg px-2 xl:px-0">
      <div className="mt-20 flex w-full  flex-col items-center gap-16 md:mt-40 md:flex-row ">
        <GuyWithGlasses className="w-80" alt="" />

        <div className="flex flex-col">
          <h2 className="text-center text-4xl font-bold text-foreground md:text-left">
            Get up to one thousand posts from any subreddit
          </h2>
          <p className="mt-4 text-center text-xl font-light text-foreground/70 md:text-left">
            The headline says it all
          </p>
        </div>
      </div>

      <div className="mt-20 flex w-full flex-col-reverse items-center gap-10 md:flex-row ">
        <div className="flex flex-col">
          <h2 className="text-center text-4xl font-bold text-foreground md:text-left">
            Show off your work with your own website
          </h2>
          <p className="mt-4 text-center text-xl font-light text-foreground/70 md:text-left">
            You can use Reddex to show off your work with your own website!
          </p>
        </div>
        <HeroImg className="w-80" alt="" />
      </div>

      <div className="mt-20 flex w-full flex-col items-center gap-10 md:mt-40 md:flex-row ">
        <Monitor className="w-80" alt="" />

        <div className="flex flex-col">
          <h2 className="text-center text-4xl font-bold text-foreground md:text-left">
            Message authors right from Reddex
          </h2>
          <p className="mt-4 text-center text-xl font-light text-foreground/70 md:text-left">
            Forget about about leaving Reddex and trying to fight your way to
            that author&apos;s profile. Queue up your messages and send your
            request with just one click!
          </p>
        </div>
      </div>

      <div className="mt-20 flex w-full flex-col-reverse items-center gap-10 md:mt-40 md:flex-row ">
        <div className="flex flex-col">
          <h2 className="text-center text-4xl font-bold text-foreground md:text-left">
            Keep track of your backlog of stories
          </h2>
          <p className="mt-4 text-center text-xl font-light text-foreground/70 md:text-left">
            Keep track of the stories you&apos;ve been given permission to read,
            and the stories you&apos;ve completed, with a reading list!
          </p>
        </div>
        <ContactIcon className="w-80" alt="" />
      </div>

      <div className="mt-20 grid grid-cols-1 gap-20 md:mt-40 md:grid-cols-2 lg:grid-cols-3 ">
        <div className="flex flex-col items-center">
          <ContactList className="h-20" alt="contact list" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            Organize your contacts
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            Keep track of those you&apos;ve contacted!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <SavedMessage className="h-20" alt="saved messages" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            No more copy and pasting from notepad
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            Autofill your messages with one of two saved messages!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <TagIcon className="h-20" alt="tags" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            Organize with tags
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            Add tags to your stories for additional organization!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <StorySubmission className="h-20" alt="story submissions" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            Accept custom written stories via your own website
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            It&apos;s super easy to get custom stories straight to your inbox
            and Reddex!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <InboxFilter className="h-20" alt="filter inbox" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            Filter your inbox
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            Search and filter your Reddit-connected inbox to easily find
            messages!
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ReadingList className="h-20" alt="reading list" />
          <h2 className="mt-6 text-center font-bold text-foreground">
            Your own reading list
          </h2>
          <p className="mt-2 text-center font-light text-foreground/60">
            Easily keep track of the stories you&apos;re allowed to read!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
