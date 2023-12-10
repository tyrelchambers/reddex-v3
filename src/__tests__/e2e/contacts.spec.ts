import test from "@playwright/test";
import { authenticate } from "../setup/auth.setup";
import { routes } from "~/routes";
import { prisma } from "~/server/db";

test.beforeEach(async () => {
  console.log("--- cleaning up database ---");

  await prisma.contact.deleteMany();

  await prisma.$disconnect();
});
test("should create contact", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await authenticate(page);

  await page.goto(routes.CONTACTS);
  await page
    .getByRole("button", {
      name: "Add contact",
    })
    .click();
  await page
    .getByRole("textbox", {
      name: "Name",
    })
    .fill("name");

  await page
    .getByRole("textbox", {
      name: "Notes",
    })
    .fill("notes");

  await page
    .getByRole("button", {
      name: "Save",
    })
    .click();

  await page
    .getByRole("paragraph", {
      name: "name",
    })
    .isVisible();
  await page.getByRole("paragraph", { name: "notes" }).isVisible();
});
