import Squiggly from "../../../public/images/undraw_fun-underline.svg";
import Link from "next/link";
import { routes } from "~/routes";
import { Badge } from "~/components/ui/badge";

const Hero = () => (
  <section className="hero mb-20 flex w-full max-w-screen-lg flex-col items-center justify-center gap-10 px-2 md:mx-auto">
    <Badge className="w-fit">Thousands of stories read</Badge>
    <div className="relative">
      <h1 className="text-center text-4xl font-semibold text-foreground md:text-6xl lg:text-7xl">
        We help Narrators like you save time and effort
      </h1>
      <span className="absolute hidden h-[600px] w-[500px] lg:right-[-140px] lg:block">
        <Squiggly id="svg-squig" />
      </span>
    </div>
    <p className="relative z-10 mt-4 max-w-3xl text-center font-light text-foreground/60 lg:text-2xl lg:leading-9">
      Reddex is a tool designed to help you find the next best Reddit story in
      no-time at all. Save hours searching for stories and requesting
      permission. Reddex helps you do all that in a matter of seconds.
    </p>

    <div className="cta-bg-parent relative h-fit w-full max-w-md">
      <div id="cta-bg"></div>
      <Link
        href={routes.SEARCH}
        className="absolute z-10 flex w-full justify-center rounded-xl bg-gradient-to-tr from-purple-400 to-pink-400 px-8 py-3 font-bold text-background shadow-xl"
      >
        Start searching
      </Link>
    </div>
  </section>
);

export default Hero;
