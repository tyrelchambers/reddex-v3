import { expect, test } from "@playwright/test";
import { env } from "~/env.mjs";

test("shows Get Started button when logged out", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
});

test("should login with reddit provider", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("button", { name: "Login with Reddit" }).click();
  await page.getByPlaceholder("\n        Username\n      ").click();
  await page
    .getByPlaceholder("\n        Username\n      ")
    .fill(env.TEST_USERNAME);
  await page.getByPlaceholder("\n        Password\n      ").click();
  await page
    .getByPlaceholder("\n        Password\n      ")
    .fill(env.TEST_PASSWORD);
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("button", { name: "Allow" }).click();

  await expect(page).toHaveURL(
    "http://localhost:3000/account-setup?redirectTo=/create-subscription#_"
  );

  await page.getByPlaceholder(`Email`).click();
  await page.getByPlaceholder(`Email`).fill("email@example.com");

  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page).toHaveURL("http://localhost:3000/create-subscription");
});
