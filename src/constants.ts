import { env } from "./env.mjs";

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

const testPrices = {
  pro: {
    monthly: {
      price: 20,
      productId: "price_1NVdCwI8C7KcVoSyV9DX54pu",
    },
    yearly: {
      price: 200,
      productId: "price_1NVdCeI8C7KcVoSypm1bJDsd",
    },
  },
  basic: {
    monthly: {
      price: 15,
      productId: "price_1NVdDlI8C7KcVoSyl5pPerfx",
    },
    yearly: {
      price: 150,
      productId: "price_1NVdDeI8C7KcVoSy03ZN2GGT",
    },
  },
};

const livePrices = {
  pro: {
    monthly: {
      price: 20,
      productId: "price_1KHc14I8C7KcVoSyCHwBi3aX",
    },
    yearly: {
      price: 200,
      productId: "price_1NQejQI8C7KcVoSyAeORTi6T",
    },
  },
  basic: {
    monthly: {
      price: 15,
      productId: "price_1K64RzI8C7KcVoSyJ6MjuR8i",
    },
    yearly: {
      price: 150,
      productId: "price_1K64eWI8C7KcVoSyvxqt7X0y",
    },
  },
};

export const plans = [
  {
    name: "Pro",
    desc: "You want organization with a custom website and to receive submissions",
    ...(env.NEXT_PUBLIC_NODE_ENV === "production"
      ? livePrices.pro
      : testPrices.pro),
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
    ...(env.NEXT_PUBLIC_NODE_ENV === "production"
      ? livePrices.basic
      : testPrices.basic),
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

export const emailTemplates = {
  confirmEmail: "d-55c4381673074d1e8fbe7a2056dd1f24",
  storySubmission: "d-b43fbb7b96a54f9ab164620ff62c6346",
  passwordChange: "d-d9efed684ca64571aa5ef8285e071cf9",
  emailChange: "d-2d0d3269b4da4e8089492b71db474dca",
  trialEnding: "d-cdf6cd0dd3a64c779c53ee0ddb6aabe9",
  forgotPassword: "d-7f17a906dceb4c7188f63d303e385e12",
};

export const contactLists = {
  users: "696f0fc7-fba0-4cfb-ae64-753dc7318772",
};

export const sendGridApiUrl = "https://api.sendgrid.com/v3";

export const YOUTUBE_URL = (channelId: string) =>
  `https://www.googleapis.com/youtube/v3/search?channelId=${channelId}&key=${env.YOUTUBE_API_KEY}&part=snippet&maxResults=6&type=video&order=date`;
