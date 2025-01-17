import { useState } from "react";
import ATRDLogo from "../../../public/images/ravendreams.jpeg";
import to42 from "../../../public/images/to_42.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/pro-regular-svg-icons";
import Marquee from "~/components/ui/marquee";
import { faStar } from "@fortawesome/pro-solid-svg-icons";

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
        <h3 className="mb-6 pb-6 text-center text-3xl text-foreground lg:text-5xl">
          What people are saying
        </h3>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {testimonials.map((item, idx) => (
            <div
              className="flex max-w-screen-lg flex-col gap-4 rounded-xl bg-card p-6 shadow"
              key={idx}
            >
              <span>
                <FontAwesomeIcon className="text-yellow-500" icon={faStar} />
                <FontAwesomeIcon className="text-yellow-500" icon={faStar} />
                <FontAwesomeIcon className="text-yellow-500" icon={faStar} />
                <FontAwesomeIcon className="text-yellow-500" icon={faStar} />
                <FontAwesomeIcon className="text-yellow-500" icon={faStar} />
              </span>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item?.avatar || undefined} />
                  <AvatarFallback className="bg-foreground/10">
                    <FontAwesomeIcon icon={faSmile} />
                  </AvatarFallback>
                </Avatar>
                <span className="block font-semibold text-foreground">
                  {item.name}
                </span>
              </div>
              <p className="text-xl font-light text-card-foreground">
                “{item.quote}“
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
