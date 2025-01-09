/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";
import { getCollectionFromDb } from "~/utils/index.server";

interface Storefront {
  verify(): Promise<boolean>;
  getCollections(): any;
}

export class Fourthwall implements Storefront {
  private token: string;
  private url: string = "https://storefront-api.fourthwall.com/v1";
  constructor(token: string) {
    this.token = token;
  }

  public async verify(): Promise<boolean> {
    const check = await this.getCollections();

    return !!check;
  }

  public async getCollections() {
    const query = await this.api().get("/collections");

    return query.data.results.filter((r: any) => r.slug !== "all");
  }

  public async getProducts(id: string) {
    const query = await this.api().get(`/collections/${id}/products`);
    return query.data;
  }

  public async collectionsWithProducts() {
    const collections = await this.getCollections();

    const payload = [];
    for (let index = 0; index < collections.length; index++) {
      const element = collections[index];
      const products = await this.getProducts(element.slug);

      element.products = products;

      const coll = await getCollectionFromDb(element.id);
      if (coll) {
        element.enabled = coll.enabled;
      }

      payload.push(element);
    }

    return payload;
  }

  private api() {
    return axios.create({
      baseURL: this.url,
      params: {
        storefront_token: this.token,
      },
    });
  }
}
