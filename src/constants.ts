export interface Plan {
  name: string;
  desc: string;
  monthly: {
    price: number;
    productId: string;
  };
  yearly: {
    price: number;
    productId: string;
  };
  isMostPop: boolean;
  features: string[];
}
export const plans = [
  {
    name: "Pro",
    desc: "You want organization with a custom website and to receive submissions",
    monthly: {
      price: 20,
      productId: "price_1KHc14I8C7KcVoSyCHwBi3aX",
    },
    yearly: {
      price: 200,
      productId: "price_1NQejQI8C7KcVoSyAeORTi6T",
    },
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
    monthly: {
      price: 15,
      productId: "price_1K64RzI8C7KcVoSyJ6MjuR8i",
    },
    yearly: {
      price: 150,
      productId: "price_1K64eWI8C7KcVoSyvxqt7X0y",
    },
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

export const breakpoints = {
  mobile: 425,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
};
