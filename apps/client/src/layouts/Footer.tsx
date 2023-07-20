import React from "react";
import logo from "../../public/images/reddex-dark.svg";
import logoLight from "../../public/images/reddex-light.svg";
import { useTheme } from "~/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
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
        <div className="flex max-w-lg flex-col items-center sm:mx-auto sm:text-center">
          {isDark ? (
            <Image src={logoLight as string} alt="" className=" w-12" />
          ) : (
            <Image src={logo as string} alt="" className=" w-12" />
          )}
          <p className="mt-2 text-[15px] leading-relaxed text-card-foreground/70">
            Discover the Best of Reddit, Effortlessly. Reddex empowers you to
            uncover captivating Reddit stories with ease, eliminating hours of
            searching and requesting permissions. Say goodbye to time-consuming
            searches and hello to finding the next best story in a matter of
            minutes.
          </p>
        </div>
        <ul className="mt-8 items-center justify-center space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
          {footerNavs.map((item, idx) => (
            <li className=" hover:text-gray-800" key={idx}>
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
        <div className="mt-8 items-center justify-between sm:flex">
          <div className="flex items-center gap-4">
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
