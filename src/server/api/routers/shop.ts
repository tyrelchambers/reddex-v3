/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Fourthwall } from "~/lib/storefront";
import { captureException } from "@sentry/node";
import { prisma } from "~/server/db";
import { collectionSchema, shopSchema } from "~/server/schemas";

export const shopRouter = createTRPCRouter({
  verifyConnection: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const storefront = new Fourthwall(input);
      try {
        return await storefront.verify();
      } catch (error) {
        console.log(error);

        return false;
      }
    }),
  update: protectedProcedure
    .input(shopSchema)
    .mutation(async ({ input, ctx }) => {
      if (!input.websiteId) {
        console.log("Missing website ID when fetching shop settings");
        captureException(
          new Error("Missing website ID when fetching shop settings"),
        );
        return;
      }
      try {
        return await prisma.shop.upsert({
          where: {
            id: input.id,
            websiteId: input.websiteId,
          },
          create: {
            id: input.id,
            token: input.token,
            type: input.type,
            websiteId: input.websiteId,
          },
          update: {
            token: input.token,
            type: input.type,
            verifiedConnection: input.verifiedConnection,
            enabled: input.enabled,
            websiteId: input.websiteId,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  settings: protectedProcedure
    .input(z.string().optional())
    .query(async ({ input, ctx }) => {
      if (!input) {
        console.log("Missing website ID when fetching shop settings");
        captureException(
          new Error("Missing website ID when fetching shop settings"),
        );
        return;
      }
      return await prisma.shop.findFirst({
        where: {
          websiteId: input,
        },
      });
    }),
  collections: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (!input) return;
      try {
        const storefront = new Fourthwall(input);

        const collectionsFromStore = await storefront.getCollections();
        const collections =
          await storefront.collectionsWithProducts(collectionsFromStore);
        console.log(collections);

        return collections;
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
  updateCollection: protectedProcedure
    .input(collectionSchema)
    .mutation(async ({ input }) => {
      try {
        return await prisma.shopCollection.upsert({
          where: {
            collectionId: input.collectionId,
          },
          create: {
            ...input,
          },
          update: {
            ...input,
          },
        });
      } catch (error) {
        captureException(error);
        throw error;
      }
    }),
});
