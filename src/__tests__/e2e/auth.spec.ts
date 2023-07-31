import { expect, test } from "@playwright/test";

test("shows Get Started button when logged out", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
});

test("should login with reddit provider", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  await page.getByRole("button", { name: "Get Started" }).click();
  await page.getByRole("button", { name: "Login with Reddit" }).click();
  await page.getByPlaceholder("\n        Username\n      ").click();
  await page
    .getByPlaceholder("\n        Username\n      ")
    .fill("Capital-Size-9254");
  await page.getByPlaceholder("\n        Password\n      ").click();
  await page.getByPlaceholder("\n        Password\n      ").fill("thisisatest");

  await page.getByRole("button", { name: /Log In/ }).click();
  await page.getByRole("button", { name: /Allow/ }).click();

  await page.getByPlaceholder(`Email`).click();
  await page.getByPlaceholder(`Email`).fill("email@example.com");

  await page.getByTestId("pricing-chip-Pro").click();

  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#cardNumber").fill("4242424242424242");
  await page.locator("#cardExpiry").fill("02/29");
  await page.locator("#cardCvc").fill("123");

  await page.locator("#billingName").fill("John Doe");
  await page.locator("#billingPostalCode").fill("a1a1a1");

  await page.getByTestId("hosted-payment-submit-button").click();

  await page.getByTestId("complete").click();

  await expect(page).toHaveURL("http://localhost:3000");
  await expect(
    page.getByRole("button", {
      name: "Capital-Size-9254",
    })
  ).toBeVisible();
  await context.close();
});
