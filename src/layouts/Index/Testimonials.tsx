import { useState } from "react";
import ATRDLogo from "../../../public/images/ravendreams.jpeg";
import to42 from "../../../public/images/to_42.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/pro-regular-svg-icons";
import Marquee from "~/components/ui/marquee";

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
  {
    avatar: to42.src,
    name: "to_42",
    quote: `Hey other narrators, did you know about this amazing tool made by @S_A_Midnight aka @ReddexApp. He made a site that helps you find stories on Reddit easier. I highly recommend it! #HorrorCommunity #Narration #HorrorFamily`,
  },
];
const Testimonials = () => {
  return (
    <section className="py-4 xl:py-14">
      <div className="mx-auto px-4 md:px-8">
        <h3 className="pb-6 text-center font-semibold text-accent">
          What people are saying
        </h3>
        <Marquee pauseOnHover className="[--duration:60s] [--gap:5rem]">
          {testimonials.map((item, idx) => (
            <div
              className="flex max-w-screen-lg flex-col items-center"
              key={idx}
            >
              <p className="text-center text-xl font-semibold text-foreground sm:text-2xl">
                “{item.quote}“
              </p>
              <div className="mt-6 flex flex-col items-center">
                <Avatar>
                  <AvatarImage src={item?.avatar || undefined} />
                  <AvatarFallback>
                    <FontAwesomeIcon icon={faSmile} />
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3">
                  <span className="block font-semibold text-foreground">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;
