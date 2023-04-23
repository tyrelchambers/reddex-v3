import axios from "axios";
import { env } from "~/env.mjs";
import { ReturnAccessToken } from "~/types";

export const getAccessToken = async (
  refresh_token: string
): Promise<ReturnAccessToken> => {
  const encode = Buffer.from(
    `${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  const { data } = await axios.post<ReturnAccessToken>(
    "https://www.reddit.com/api/v1/access_token",
    `grant_type=refresh_token&refresh_token=${refresh_token}`,

    {
      headers: {
        Authorization: `Basic ${encode}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data;
};
