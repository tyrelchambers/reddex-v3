import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
