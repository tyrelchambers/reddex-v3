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

export default Features;
