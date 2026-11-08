import { expect, test, type Page } from "@playwright/test";

async function openFilters(page: Page, isMobile: boolean) {
  if (!isMobile) return page.getByRole("complementary", { name: "Filters" });
  await page.getByRole("button", { name: "Filters", exact: false }).last().click();
  return page.getByRole("dialog", { name: "Filters" });
}

test("lists products with categories loaded from the API", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(page.getByRole("link").filter({ has: page.getByRole("img") })).toHaveCount(12);
  const filters = await openFilters(page, isMobile);
  await expect(filters.getByLabel("Beauty", { exact: true })).toBeVisible();

  await filters.getByRole("button", { name: /Show all/ }).first().click();
  await expect(filters.getByLabel("Smartphones", { exact: true })).toBeVisible();
});

test("filters combine, reset the page and survive a trip to the detail page", async ({
  page,
  isMobile,
}) => {
  await page.goto("/?page=2");
  const filters = await openFilters(page, isMobile);

  await filters.getByRole("searchbox", { name: "Search filters" }).fill("smart");
  await filters.getByLabel("Smartphones", { exact: true }).check();
  await expect(page).toHaveURL(/\?category=smartphones$/);

  await filters.getByRole("searchbox", { name: "Search filters" }).fill("");
  await filters.getByLabel("Apple", { exact: true }).check();
  await filters.getByLabel("Maximum price").fill("500");
  await filters.getByRole("button", { name: "Apply" }).click();

  await expect(page).toHaveURL(/category=smartphones&brand=Apple&maxPrice=500/);
  await expect(page.getByText("2 products")).toBeVisible();

  if (isMobile) await page.keyboard.press("Escape");
  await page.getByRole("link", { name: /iPhone 6/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "iPhone 6" })).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/category=smartphones&brand=Apple&maxPrice=500/);
  await expect(page.getByText("2 products")).toBeVisible();
});

test("navbar search filters the list as you type", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search products" }).fill("iphone");

  await expect(page).toHaveURL(/q=iphone/);
  const cards = page.getByRole("link", { name: /iphone/i });
  await expect(cards.first()).toBeVisible();
  await expect(page.getByRole("link", { name: /mascara/i })).toHaveCount(0);
});

test("rejects a min price above the max price", async ({ page, isMobile }) => {
  await page.goto("/");
  const filters = await openFilters(page, isMobile);

  await filters.getByLabel("Minimum price").fill("100");
  await filters.getByLabel("Maximum price").fill("10");
  await filters.getByRole("button", { name: "Apply" }).click();

  await expect(filters.getByRole("alert")).toHaveText(/can't be more than max/);
  await expect(page).not.toHaveURL(/minPrice/);
});
