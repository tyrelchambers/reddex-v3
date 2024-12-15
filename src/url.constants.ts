import { env } from "./env.js";

export const apiBaseUrl = env.NEXT_URL;
export const PULL_ZONE = `https://reddex.b-cdn.net`;
export const UPLOAD_BASE_URL = `https://storage.bunnycdn.com/reddex-images`;
export const THUMBNAIL_UPLOAD_URL = (fileName: string) =>
  `${UPLOAD_BASE_URL}/thumbnail/${fileName}`;
export const BANNER_UPLOAD_URL = (fileName: string) =>
  `${UPLOAD_BASE_URL}/banner/${fileName}`;

export const CHECKOUT_SUCCESS_URL = `${apiBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;

export const COMPOSE_MESSAGE_URL = `https://oauth.reddit.com/api/compose`;
