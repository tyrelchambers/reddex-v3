import {
  faBrowser,
  faCog,
  faInbox,
  faInboxIn,
  faLayerGroup,
  faPalette,
  faPenNib,
  faPuzzlePiece,
  faRectangleHistory,
  faRectangleList,
  faTag,
  faUser,
} from "@fortawesome/pro-light-svg-icons";

import { Tab } from "./types";

export const routes = {
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  LOGIN: "/login",
  AUTH_REDDIT: "/auth/callback/reddit",
  COMPLETED: "/dashboard/stories/completed",
  SUBMITTED: "/dashboard/stories/submitted",
  TAGS: "/dashboard/tags",
  CONTACTS: "/dashboard/contacts",
  INBOX: "/dashboard/inbox",
  WEBSITE: "/dashboard/website",
  SETTINGS: "/dashboard/settings",
  APPROVED: "/dashboard/stories/approved",
  WEBSITE_GENERAL: "/dashboard/website/general",
  SUBSCRIPTION_CHECK: "/subscription-check",
  SETTINGS_PROFILE: "/dashboard/settings/profile",
  SETTINGS_ACCOUNT: "/dashboard/settings/account",
  SEARCH: "/search",
  STUDIO: "/dashboard/studio",
  ONBOARDING: "/onboarding",
};

export const dashNavRoutes = [
  {
    label: "Stories",
    slug: routes.APPROVED,
    icon: faLayerGroup,
  },
  {
    label: "Tags",
    slug: routes.TAGS,
    icon: faTag,
  },
  {
    label: "Contacts",
    slug: routes.CONTACTS,
    icon: faUser,
  },
  {
    label: "Inbox",
    slug: routes.INBOX,
    icon: faInbox,
  },
  {
    label: "Website",
    slug: routes.WEBSITE_GENERAL,
    icon: faBrowser,
  },
  {
    label: "Settings",
    slug: routes.SETTINGS_PROFILE,
    icon: faCog,
  },
];

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
];

export const storiesTabs: Tab[] = [
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

export const settingsTabs: Tab[] = [
  {
    label: "Profile",
    slug: routes.SETTINGS_PROFILE,
    icon: faUser,
  },
  {
    label: "Account",
    slug: routes.SETTINGS_ACCOUNT,
    icon: faCog,
  },
];

export const routeWhitelist = [
  routes.HOME,
  routes.ABOUT,
  routes.PRICING,
  routes.LOGIN,
  routes.AUTH_REDDIT,
  routes.SETTINGS_ACCOUNT,
  routes.SEARCH,
];
