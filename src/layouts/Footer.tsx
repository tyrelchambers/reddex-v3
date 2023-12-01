import React from "react";
import Logo from "../../public/images/reddex-dark.svg";
import LogoLight from "../../public/images/reddex-light.svg";
import { useTheme } from "~/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { routes } from "~/routes";

const footerNavs = [
  {
    href: routes.HOME,
    name: "Home",
  },
  {
    href: routes.PRICING,
    name: "Pricing",
  },
  {
    href: routes.SEARCH,
    name: "Search",
  },
  {
    href: routes.LOGIN,
    name: "Login",
  },
];

const Footer = () => {
  const { isDark } = useTheme();
  const currentYear = new Date(Date.now()).getFullYear();

  return (
    <footer className="w-full bg-card">
      <div className="mx-auto mt-8 max-w-screen-xl px-4 py-5 text-gray-500 md:px-8">
        <div className="flex max-w-3xl flex-col items-center sm:mx-auto sm:text-center">
          {isDark ? (
            <LogoLight className="h-12 w-12" />
          ) : (
            <Logo className="h-12 w-12" />
          )}
          <p className="mt-2 text-[15px] leading-relaxed text-card-foreground/70">
            Discover the Best of Reddit, Effortlessly. Reddex empowers you to
            uncover captivating Reddit stories with ease, eliminating hours of
            searching and requesting permissions. Say goodbye to time-consuming
            searches and hello to finding the next best story in a matter of
            minutes.
          </p>
        </div>

        <div className="mt-8 items-center justify-between sm:flex">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="mt-4 text-sm sm:mt-0">
              &copy; {currentYear} Reddex All rights reserved.
            </div>
            <p className="text-sm">
              See an issue or have a suggestion?{" "}
              <a
                href="https://tally.so/r/w8Ex5n"
                target="_blank"
                className="text-accent underline hover:text-accent/80"
              >
                Let us know!
              </a>
            </p>
          </div>
          <div className="mt-6 sm:mt-0">
            <ul className="flex items-center space-x-4">
              <li>
                <a href="https://twitter.com/reddexapp" target="_blank">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <style jsx>{`
          .svg-icon path,
          .svg-icon polygon,
          .svg-icon rect {
            fill: currentColor;
          }
        `}</style>
      </div>
    </footer>
  );
};

export default Footer;
