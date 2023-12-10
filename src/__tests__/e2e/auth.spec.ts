import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { env } from "~/env.mjs";
import { stripeClient } from "~/utils/stripe";
import { authenticate } from "../setup/auth.setup";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.TEST_DATABASE_URL,
    },
  },
});

test.beforeAll(() => {
  console.log("--- migrating database ---");
});
test.afterEach(async () => {
  console.log("--- cleaning up database ---");

  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([deleteUsers]);

  const cus = await stripeClient.customers.search({
    query: `email:"capital-size-925"`,
  });

  if (cus.data[0]) {
    console.log(`Deleted customer: ${cus.data[0]?.id}`);

    await stripeClient.customers.del(cus.data[0].id);
  }

  await prisma.$disconnect();
});

test("shows Login button when logged out", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});

test("should login with reddit provider", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await authenticate(page);

  await page.getByPlaceholder(`Email`).click();
  await page.getByPlaceholder(`Email`).fill("email@example.com");

  await page.getByTestId("pricing-chip-Pro").click();

  await page.getByRole("button", { name: "Continue" }).click();

  const startTrialButton = page.getByRole("button", {
    name: "Start trial",
  });

  if (startTrialButton) {
    startTrialButton.click();
  } else {
    await page.locator("#cardNumber").fill("4242424242424242");
    await page.locator("#cardExpiry").fill("02/29");
    await page.locator("#cardCvc").fill("123");

    await page.locator("#billingName").fill("John Doe");
    await page.locator("#billingPostalCode").fill("a1a1a1");
  }
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
