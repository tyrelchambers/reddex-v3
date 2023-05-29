import {
  faBrowser,
  faCog,
  faInboxIn,
  faPalette,
  faPenNib,
  faPuzzlePiece,
  faRectangleHistory,
  faRectangleList,
} from "@fortawesome/pro-light-svg-icons";

export const routes = {
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  LOGIN: "/login",
  AUTH_REDDIT: "/auth/callback/reddit",
  COMPLETED: "/dashboard/stories/completed",
  SUBMITTED: "/dasboard/stories/submitted",
  TAGS: "/dashboard/tags",
  CONTACTS: "/dashboard/contacts",
  INBOX: "/dashboard/inbox",
  WEBSITE: "/dashboard/website",
  SETTINGS: "/dashboard/settings",
  APPROVED: "/dashboard/stories/approved",
  WEBSITE_GENERAL: "/dashboard/website/general",
  SUBSCRIPTION_CHECK: "/subscription-check",
};
export const websiteTabItems = [
  {
    label: "General",
    slug: "general",
    icon: faBrowser,
  },
  {
    label: "Theme",
    slug: "theme",
    icon: faPalette,
  },
  {
    label: "Submission Form",
    slug: "submission-form",
    icon: faPenNib,
  },
  {
    label: "Integrations",
    slug: "integrations",
    icon: faPuzzlePiece,
  },
  {
    label: "Settings",
    slug: "settings",
    icon: faCog,
  },
];

export const storiesTabs = [
  {
    label: "Approved",
    slug: routes.APPROVED,
    icon: faRectangleHistory,
  },
  {
    label: "Completed",
    slug: routes.COMPLETED,
    icon: faRectangleList,
  },
  {
    label: "Submitted",
    slug: routes.SUBMITTED,
    icon: faInboxIn,
  },
];
