import { env } from "./env";

export interface Plan {
  name: string;
  desc: string;
  price: string;
  features: string[];
  featured?: boolean;
}

interface Price {
  [x: string]: string;
}

const testPrices: Price = {
  ultimate: "price_1QVxDyI8C7KcVoSyVgMmfQZB",
};

const livePrices: Price = {
  ultimate: "",
};

export const getPrices: () => Price = () => {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
    return testPrices;
  return livePrices;
};

export const plans = [
  {
    name: "Ultimate",
    desc: "You want organization with a custom website to receive submissions",
    price: "$8",
    featured: true,
    features: [
      "Customize your reading list",
      "Unlimited reading history",
      "Submission form to receive stories",
      "Save personalized messages",
      "Searchable Reddit-connected inbox",
      "Customizable personal website",
      "Contact list",
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
