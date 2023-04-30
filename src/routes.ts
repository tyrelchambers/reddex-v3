import {
  faBrowser,
  faCog,
  faPalette,
  faPenNib,
  faPuzzlePiece,
} from "@fortawesome/pro-light-svg-icons";

export const routes = {
  HOME: "/home",
  ABOUT: "/about",
  PRICING: "/pricing",
  LOGIN: "/login",
  AUTH_REDDIT: "/auth/callback/reddit",
  COMPLETED: "/dashboard/completed",
  SUBMITTED: "/dasboard/submitted",
  TAGS: "/dashboard/tags",
  CONTACTS: "/dashboard/contacts",
  INBOX: "/dashboard/inbox",
  WEBSITE: "/dashboard/website",
  SETTINGS: "/dashboard/settings",
  STORIES: "/dashboard/stories",
  WEBSITE_GENERAL: "/dashboard/website/general",
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
