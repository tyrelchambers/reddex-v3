import { Badge } from "@mantine/core";
import { mantineBadgeClasses } from "~/lib/styles";
import Squiggly from "../../../public/images/undraw_fun-underline.svg";
import Link from "next/link";
import { routes } from "~/routes";

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

export default Hero;