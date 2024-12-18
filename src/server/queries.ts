import { refreshAccessToken } from "~/utils/getTokens";
import { prisma } from "./db";

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getAccessTokenFromServer = async (userId: string) => {
  const userAccount = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      accounts: true,
    },
  });
  const redditAccount = userAccount?.accounts.find(
    (acc) => acc.provider === "reddit",
  );

  if (!redditAccount?.access_token) return;

  const accessToken = await refreshAccessToken(redditAccount);

  return accessToken;
};
