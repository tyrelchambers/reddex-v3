import {
  faBrowser,
  faCog,
  faInboxIn,
  faPalette,
  faPenNib,
  faPuzzlePiece,
  faRectangleHistory,
  faRectangleList,
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
  ACCOUNT_CHECK: "/account-setup",
  SETTINGS_PROFILE: "/dashboard/settings/profile",
  SETTINGS_ACCOUNT: "/dashboard/settings/account",
  SEARCH: "/search",
  STUDIO: "/dashboard/studio",
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
