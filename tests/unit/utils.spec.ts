import { beforeEach, describe, expect, test } from "vitest";
import {
  activeFilters,
  buildParams,
  formatCurrency,
  formatStripeTime,
  formatSubject,
  hasActiveSubscription,
  hasProPlan,
  isFilterWithQualifier,
  parseQuery,
} from "../../src/utils";
import { User } from "@prisma/client";
import Stripe from "stripe";
import { FilterState } from "../../src/types";
import queryString from "query-string";
import { DexieInstance } from "../../src/utils/dexie";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";
import { addMinutes } from "date-fns";

let db = new DexieInstance("TestDatabase", {
  indexedDB: indexedDB,
  IDBKeyRange: IDBKeyRange,
});

db.version(1).stores({
  posts:
    "++Did, author, created, created_utc, id, link_flair_text, num_comments, selftext, subreddit, title, ups, upvote_ratio, url", // Primary key and indexed props
  lastSearched: "++Did, time",
});

test("formatStripeTime: should return a formatted unix time", () => {
  const time = 1638269000;
  const formattedTime = formatStripeTime(time);

  expect(formattedTime).toEqual("November 30th, 2021");
});

describe("hasActiveSubscription", () => {
  test("should return true if active subscription exists", () => {
    const user: User & {
      subscription: Stripe.Subscription | null;
    } = {
      customerId: "cus_123",
      email: "nJhIq@example.com",
      name: "John Doe",
      emailVerified: null,
      id: "123",
      image: null,
      setToDelete: false,
      subscription: {
        status: "active",
      } as Stripe.Subscription,
    };

    expect(hasActiveSubscription(user)).toBe(true);
  });

  test("should return false if no user exists", () => {
    expect(hasActiveSubscription(null)).toBe(false);
  });

  test("should return false if subscription status is not 'active'", () => {
    const user: User & {
      subscription: Stripe.Subscription | null;
    } = {
      customerId: "cus_123",
      email: "nJhIq@example.com",
      name: "John Doe",
      emailVerified: null,
      id: "123",
      image: null,
      setToDelete: false,
      subscription: {
        status: "canceled",
      } as Stripe.Subscription,
    };

    expect(hasActiveSubscription(user)).toBe(false);
  });
});

describe("isFilterWithQualifier", () => {
  test("should return true if filter has a qualifier", () => {
    expect(isFilterWithQualifier({ qualifier: "test" })).toBe(true);
  });

  test("should return false if filter does not have a qualifier", () => {
    expect(isFilterWithQualifier({})).toBe(false);
  });
});

describe("buildParams", () => {
  test("should return an array of filters", () => {
    const filters: Partial<FilterState> = {
      excludeSeries: true,
      keywords: "test",
      readingTime: {
        qualifier: "Over",
        value: 10,
      },
      seriesOnly: true,
      upvotes: {
        qualifier: "Over",
        value: 10,
      },
    };

    const expectedResult =
      "excludeSeries=true&keywords=test&readingTime=Over,10&seriesOnly=true&upvotes=Over,10";

    expect(buildParams(filters)).toEqual(expectedResult);
  });

  test("it should exclude objects with a value of 0", () => {
    const filters: Partial<FilterState> = {
      excludeSeries: true,
      keywords: "test",
      readingTime: {
        qualifier: "Over",
        value: 0,
      },
      seriesOnly: true,
      upvotes: {
        qualifier: "Over",
        value: 0,
      },
    };

    const expectedResult = "excludeSeries=true&keywords=test&seriesOnly=true";

    expect(buildParams(filters)).toEqual(expectedResult);
  });
});

describe("parseQuery", () => {
  test("it should parse qualifier and value from object property", () => {
    const query =
      "excludeSeries=true&keywords=test&readingTime=Over,10&seriesOnly=true&upvotes=Over,10";

    const parsed = queryString.parse(query);

    const expectResult: Partial<FilterState> = {
      excludeSeries: true,
      keywords: "test",
      readingTime: {
        qualifier: "Over",
        value: 10,
      },
      seriesOnly: true,
      upvotes: {
        qualifier: "Over",
        value: 10,
      },
    };

    expect(parseQuery(parsed)).toEqual(expectResult);
  });
});

describe("formatSubject", () => {
  test("should limit length to 100 chars", () => {
    const string = Array(103).join("a");

    const expected = Array(98).join("a") + "...";

    expect(formatSubject(string)).toEqual(expected);
  });

  test("should not show ellipses if under 100 chars", () => {
    const string = Array(99).join("a");

    expect(formatSubject(string)).toEqual(string);
  });
});

describe("formatCurrency", () => {
  test("should format currency", () => {
    const amount = 100;

    expect(formatCurrency(amount, "usd")).toEqual("$1.00");
  });
});

describe("activeFilters", () => {
  test("should return an empty array if no filters", () => {
    expect(activeFilters(null)).toEqual([]);
  });

  test("should return an array of active filters", () => {
    const filters: Partial<FilterState> = {
      excludeSeries: true,
      keywords: "test",
      readingTime: {
        qualifier: "Over",
        value: 10,
      },
      seriesOnly: true,
      upvotes: {
        qualifier: "Over",
        value: 10,
      },
    };

    expect(activeFilters(filters)).toEqual([
      { label: "upvotes", value: "upvotes" },
      { label: "reading time", value: "readingTime" },
      { label: "keywords", value: "keywords" },
      { label: "series only", value: "seriesOnly" },
      { label: "exclude series", value: "excludeSeries" },
    ]);
  });
});

describe("IndexedDb", () => {
  beforeEach(() => {
    db = new DexieInstance("TestDatabase", {
      indexedDB: indexedDB,
      IDBKeyRange: IDBKeyRange,
    });
  });

  const sample = (id: string) => ({
    Did: id,
    author: "test",
    id: "1",
    title: "test",
    url: "test",
    subreddit: "test",
    ups: 1,
    upvote_ratio: 1,
    created: Number(1063860000),
    created_utc: Number(1063860000),
    link_flair_text: "test",
    num_comments: 1,
    selftext: "test",
  });

  test("should add posts to database", async () => {
    db.posts.bulkAdd([
      sample("1"),
      sample("2"),
      sample("3"),
      sample("4"),
      sample("5"),
    ]);

    const exists = await db.posts.toArray();

    expect(exists).toEqual([
      sample("1"),
      sample("2"),
      sample("3"),
      sample("4"),
      sample("5"),
    ]);
  });

  test("should add lastSearched to database", async () => {
    const time = new Date("2023-07-21T02:10:19.308Z");
    db.lastSearched.add({ time });

    const exists = await db.lastSearched.toArray();

    expect(exists).toEqual([{ Did: 1, time }]);
  });

  test("should update existing lastSearched", async () => {
    const time = new Date("2023-07-21T02:10:19.308Z");
    const updatedTime = addMinutes(time, 1);

    db.lastSearched.add({ time });

    await db.lastSearched.update(1, { time: updatedTime });

    const exists = await db.lastSearched.get(1);

    expect(exists).toEqual({ Did: 1, time: updatedTime });
  });
});

describe("hasProPlan", () => {
  test("should return true if plan is pro", () => {
    const subscription = {
      plan: {
        product: {
          name: "Pro",
        },
      },
    } as Stripe.Subscription & {
      plan: Stripe.Plan & { product: Stripe.Product };
    };
    expect(hasProPlan(subscription)).toBe(true);
  });

  test("should return false if plan is basic", () => {
    const subscription = {
      plan: {
        product: {
          name: "Basic",
        },
      },
    } as Stripe.Subscription & {
      plan: Stripe.Plan & { product: Stripe.Product };
    };
    expect(hasProPlan(subscription)).toBe(false);
  });
});
