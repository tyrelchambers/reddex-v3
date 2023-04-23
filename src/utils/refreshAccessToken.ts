import { Account } from "@prisma/client";
import { getAccessToken } from "./getAccessToken";
import { prisma } from "~/server/db";

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
