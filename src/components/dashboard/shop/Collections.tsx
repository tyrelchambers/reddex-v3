/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { collectionSchema } from "~/server/schemas";
import { api } from "~/utils/api";

interface Props {
  shopId: string;
  collections: z.infer<typeof collectionSchema>[];
}
const Collections = ({ shopId, collections }: Props) => {
  const apiContext = api.useUtils();
  const updateCollections = api.shop.updateCollection.useMutation({
    onSuccess: () => {
      apiContext.shop.collections.invalidate();
    },
  });

  const update = (coll: z.infer<typeof collectionSchema>) => {
    const { products, id, ...rest } = coll;
    updateCollections.mutate({
      ...rest,
      collectionId: coll.id ?? "",
      shopId,
    });
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-medium text-foreground">Collections</h2>
      <div className="flex flex-col gap-6">
        {collections.map((c) => (
          <div
            key={c.name}
            className="flex flex-col items-center justify-between rounded-xl bg-card p-4"
          >
            <div className="flex w-full flex-col items-start justify-between lg:flex-row">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-start gap-2 md:flex-row lg:items-center">
                  <h3 className="text-xl font-medium text-foreground">
                    {c.name}{" "}
                  </h3>
                  <p className="text-xs text-muted-foreground">ID: {c.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Slug: {c.slug}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>

              <Button
                variant={c.enabled ? "destructive" : "secondary"}
                type="button"
                onClick={() => update({ ...c, enabled: !c.enabled })}
              >
                {c.enabled ? "Disable collection" : "Enable collection"}
              </Button>
            </div>

            <div className="mt-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c.products?.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center rounded-lg bg-card p-4"
                >
                  <Image
                    src={p.images[0].url}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                  <p className="mt-4 text-center font-medium text-card-foreground">
                    {p.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;
