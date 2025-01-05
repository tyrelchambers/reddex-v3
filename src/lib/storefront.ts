/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";

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

    return query.data;
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
