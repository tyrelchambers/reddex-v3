import React from "react";
import { api } from "~/utils/api";

interface Props {
  websiteId: string;
}

const CustomCollections = ({ websiteId }: Props) => {
  const collections = api.shop.collectionsFromDb.useQuery(websiteId);
  return (
    <div>
      <h2 className="text-3xl font-medium text-foreground">Storefront</h2>
    </div>
  );
};

export default CustomCollections;
