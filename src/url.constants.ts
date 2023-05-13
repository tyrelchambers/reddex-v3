export const PULL_ZONE = `reddex.b-cdn.net`;
export const UPLOAD_BASE_URL = `https://storage.bunnycdn.com/reddex-images`;
export const THUMBNAIL_UPLOAD_URL = (fileName: string) =>
  `${UPLOAD_BASE_URL}/thumbnail/${fileName}`;
export const BANNER_UPLOAD_URL = (fileName: string) =>
  `${UPLOAD_BASE_URL}/banner/${fileName}`;
