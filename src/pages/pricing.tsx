import { clsx } from "@mantine/core";
import React from "react";
import Header from "~/layouts/Header";

const plans = [
  {
    name: "Pro",
    desc: "You want organization with a custom website and to receive submissions",
    price: 15,
    yearlyPrice: 165,
    isMostPop: true,
    features: [
      "Customize your reading list",
      "Unlimited reading history",
      "Submission form to receive stories",
      "Save personalized messages",
      "Searchable Reddit-connected inbox",
      "Customizable personal website",
      "Custom website",
      "Contact list",
    ],
  },
  {
    name: "Basic",
    desc: "You want organization from stories to contacts, but don't need a custom website",
    price: 10,
    yearlyPrice: 110,
    isMostPop: false,
    features: [
      "Customize your reading list",
      "Unlimited reading history",
      "Contact list",
      "Save personalized messages",
      "Searchable Reddit-connected inbox",
      "Customizable personal website",
    ],
  },
];

const Pricing = () => {
  const [frequency, setFrequency] = React.useState<"yearly" | "monthly">(
    "yearly"
  );

  return (
    <>
      <Header />
      <section className="relative py-14">
        <div
          className="absolute top-0 h-[521px] w-full"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.17) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
          }}
        ></div>
        <div className="mx-auto max-w-screen-xl text-gray-600 sm:px-4 md:px-8">
          <div className="relative mx-auto max-w-xl space-y-3 px-4 sm:px-0 sm:text-center">
            <h3 className="font-semibold text-indigo-500">Pricing</h3>
            <p className="text-3xl font-semibold text-gray-800 sm:text-4xl">
              Choose the plan that best suits you.
            </p>
            <div className="max-w-xl">
              <p>
                Take back your time and become a more efficient creator. No
                credit card required until the trial is over. No commitments. No
                hidden fees.
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex justify-center">
            <div className="rounded-full bg-white p-1">
              <button
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold duration-150",
                  {
                    "bg-indigo-500 text-white": frequency === "yearly",
                  }
                )}
                type="button"
                onClick={() => setFrequency("yearly")}
              >
                Yearly
              </button>
              <button
                onClick={() => setFrequency("monthly")}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold duration-150",
                  {
                    "bg-indigo-500 text-white": frequency === "monthly",
                  }
                )}
                type="button"
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="mt-16 justify-center sm:flex">
            {plans.map((item, idx) => (
              <div
                key={idx}
                className={`relative mt-6 flex flex-1 flex-col items-stretch sm:mt-0 sm:max-w-md sm:rounded-xl ${
                  item.isMostPop ? "bg-white shadow-lg sm:border" : ""
                }`}
              >
                <div className="space-y-4 border-b p-4 py-8 md:p-8">
                  <span className="font-medium text-indigo-500">
                    {item.name}
                  </span>
                  <div className="text-3xl font-semibold text-gray-800">
                    ${frequency === "yearly" ? item.yearlyPrice : item.price}{" "}
                    <span className="text-xl font-normal text-gray-600">
                      /mo
                    </span>
                  </div>
                  <p>{item.desc}</p>
                  <button className="w-full rounded-lg bg-indigo-500 px-3 py-3 text-sm font-semibold text-white duration-150 hover:bg-indigo-500 active:bg-indigo-700">
                    Get Started
                  </button>
                </div>
                <ul className="space-y-3 p-4 py-8 md:p-8">
                  <li className="pb-2 font-medium text-gray-800">
                    <p>Features</p>
                  </li>
                  {item.features.map((featureItem, idx) => (
                    <li key={idx} className="flex items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-indigo-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      {featureItem}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
