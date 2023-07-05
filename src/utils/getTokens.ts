import { Account } from "@prisma/client";
import axios from "axios";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
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

export const refreshAccessToken = async (redditAccount: Account) => {
  if (
    redditAccount.expires_at &&
    redditAccount.refresh_token &&
    redditAccount.expires_at < Date.now() / 1000
  ) {
    const { access_token, refresh_token, expires_at } = await getAccessToken(
      redditAccount.refresh_token
    );

    await prisma.account.update({
      where: {
        id: redditAccount.id,
      },
      data: {
        access_token,
        refresh_token,
        expires_at,
      },
    });

    return access_token;
  }

  return redditAccount.access_token;
};
