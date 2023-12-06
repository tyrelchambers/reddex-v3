import { useState } from "react";
import ATRDLogo from "../../../public/images/ravendreams.jpeg";
import to42 from "../../../public/images/to_42.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/pro-regular-svg-icons";

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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
                      <p className="text-xl font-semibold text-foreground sm:text-2xl">
                        “{item.quote}“
                      </p>
                    </blockquote>
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

export default Testimonials;
