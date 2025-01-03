import ContactIcon from "../../../public/images/monitor_illustration_2.svg";
import Monitor from "../../../public/images/monitor_illustration.svg";
import ReadingList from "../../../public/images/colorful_icon_2.svg";
import InboxFilter from "../../../public/images/colorful_icon_7.svg";
import SavedMessage from "../../../public/images/ecommerce_icons_1.svg";
import TagIcon from "../../../public/images/organization_icons_4.svg";
import ContactList from "../../../public/images/random_icons_6.svg";
import StorySubmission from "../../../public/images/seo_icons_6.svg";
import GuyWithGlasses from "../../../public/images/guy_with_glasses.svg";
import HeroImg from "../../../public/images/hero_illustration.svg";
import clsx from "clsx";
import BlurFade from "~/components/ui/blur-fade";
import { describe } from "node:test";

const features = [
  {
    title: "Get up to one thousand posts from any subreddit",
    description: "The headline says it all",
    image: <GuyWithGlasses className="w-80" alt="" />,
    imagePos: "left",
  },
  {
    title: "Show off your work with your own website",
    description:
      "You can use Reddex to show off your work with your own website!",
    image: <HeroImg className="w-80" alt="" />,
    imagePos: "right",
  },
  {
    title: "Message authors right from Reddex",
    description:
      "Forget about about leaving Reddex and trying to fight your way to that author's profile. Queue up your messages and send your request with just one click!",
    image: <Monitor className="w-80" alt="" />,
    imagePos: "left",
  },
  {
    title: "Keep track of your backlog of stories",
    description:
      "Keep track of the stories you've been given permission to read, and the stories you've completed, with a reading list!",
    image: <ContactIcon className="w-80" alt="" />,
    imagePos: "right",
  },
];

const additionalFeatures = [
  {
    title: "Organize your contacts",
    description: "Keep track of those you've contacted!",
    image: <ContactList className="h-20" alt="" />,
  },
  {
    title: "No more copy and pasting from notepad",
    description: "Autofill your messages with one of two saved messages!",
    image: <SavedMessage className="h-20" alt="saved messages" />,
  },
  {
    title: "Organize with tags",
    description: "Add tags to your stories for additional organization!",
    image: <TagIcon className="h-20" alt="tags" />,
  },
  {
    title: "Accept custom written stories via your own website",
    description:
      "It's super easy to get custom stories straight to your inbox and Reddex!",
    image: <StorySubmission className="h-20" alt="story submissions" />,
  },
  {
    title: "Filter your inbox",
    description:
      "Search and filter your Reddit-connected inbox to easily find messages!",
    image: <InboxFilter className="h-20" alt="filter inbox" />,
  },
  {
    title: "Your own reading list",
    description: "Easily keep track of the stories you're allowed to read!",
    image: <ReadingList className="h-20" alt="reading list" />,
  },
];

const Features = () => {
  return (
    <section className="mx-auto max-w-screen-lg px-2 xl:px-0">
      {features.map((f, idx) => (
        <BlurFade key={f.title} delay={idx * 0.25} inView>
          <div
            className={clsx(
              "mt-20 flex w-full flex-col items-center gap-16 md:mt-40 md:flex-row",
              f.imagePos === "right" && "flex-col-reverse md:flex-row-reverse",
            )}
          >
            {f.image}
            <div className="flex flex-col">
              <h2 className="text-center text-4xl font-bold text-foreground md:text-left">
                {f.title}
              </h2>
              <p className="mt-4 text-center text-xl font-light text-foreground/70 md:text-left">
                {f.description}
              </p>
            </div>
          </div>
        </BlurFade>
      ))}

      <div className="mt-20 grid grid-cols-1 gap-20 md:mt-40 md:grid-cols-2 lg:grid-cols-3">
        {additionalFeatures.map((f, idx) => (
          <BlurFade key={f.title} delay={idx * 0.25} inView>
            <div className="flex flex-col items-center">
              {f.image}
              <h2 className="mt-6 text-center font-bold text-foreground">
                {f.title}
              </h2>
              <p className="mt-2 text-center font-light text-foreground/60">
                {f.description}
              </p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default Features;
