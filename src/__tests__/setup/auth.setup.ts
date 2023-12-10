import { Page } from "@playwright/test";

export const authenticate = async (page: Page) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button", { name: "Login with Reddit" }).click();
  await page.getByPlaceholder("\n        Username\n      ").click();
  await page
    .getByPlaceholder("\n        Username\n      ")
    .fill("Capital-Size-9254");
  await page.getByPlaceholder("\n        Password\n      ").click();
  await page.getByPlaceholder("\n        Password\n      ").fill("thisisatest");

  await page.getByRole("button", { name: /Log In/ }).click();
  await page.getByRole("button", { name: /Allow/ }).click();
};
