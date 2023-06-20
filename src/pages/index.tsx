import { type NextPage } from "next";
import Head from "next/head";
import Header from "~/layouts/Header";
import { Badge } from "@mantine/core";
import { mantineBadgeClasses } from "~/lib/styles";
import { api } from "~/utils/api";
import Footer from "~/layouts/Footer";
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
          {statsQuery.data && <Stats stats={statsQuery.data} />}
        </div>
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
    <section>
      <p className="text-center font-bold text-muted-foreground">
        Trusted by these great narrators
      </p>

      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {usedBy.map((u) => (
          <li key={u} className="text-3xl font-black text-foreground">
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
    <section className="rounded-xl bg-gray-900 py-28">
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="max-w-2xl xl:mx-auto xl:text-center">
          <h3 className="text-3xl font-semibold text-white sm:text-4xl">
            Narrators love Reddex!
          </h3>
          <p className="mt-3 text-gray-300">
            Seriously, Reddex can save you a boat load of time and gives you a
            ton of cool features
          </p>
        </div>
        <div className="mt-12">
          <ul className="flex-wrap items-start gap-x-12 gap-y-10 space-y-8 sm:flex sm:space-y-0 xl:justify-center">
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
  <section className="hero mx-auto flex w-full max-w-screen-md  flex-col items-center justify-center gap-10">
    <Badge className="w-fit" classNames={mantineBadgeClasses} color="rose">
      Thousands of stories read
    </Badge>
    <h1 className="text-center text-5xl font-semibold text-foreground">
      We help Narrators like you save time and effort
    </h1>
    <p className="text-center text-2xl font-thin text-muted-foreground">
      Reddex is a tool designed to help you find the next best Reddit story in
      no-time at all. Save hours searching for stories and requesting
      permission. Reddex helps you do all that in a matter of minutes.
    </p>
  </section>
);

export default Home;
