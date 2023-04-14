import React from "react";
import logo from "../../public/images/reddex-dark.svg";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@mantine/core";
import { routes } from "~/routes";

const _routes = [
  {
    label: "Home",
    slug: "/",
  },
  {
    label: "About",
    slug: "/about",
  },
  {
    label: "Pricing",
    slug: "/pricing",
  },
];

const Header = () => {
  return (
    <header className="mx-auto flex max-w-screen-2xl items-center justify-between py-4">
      <div className="flex items-center">
        <Image src={logo} alt="" className="w-12" />
        <nav className="ml-4">
          <ul className="flex gap-4">
            {_routes.map((r) => (
              <li key={r.label}>
                <Link href={r.slug}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex">
        <Link href={routes.LOGIN} className="button main">
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;
