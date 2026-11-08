import { expect, test, type Page } from "@playwright/test";

async function openFilters(page: Page, isMobile: boolean) {
  if (!isMobile) return page.getByRole("complementary", { name: "Filters" });
  await page.getByRole("button", { name: "Filters", exact: false }).last().click();
  return page.getByRole("dialog", { name: "Filters" });
}

const productCards = (page: Page) => page.locator('main a[href^="/product/"]').filter({ visible: true });

async function prices(page: Page) {
  const values = await productCards(page).locator("[data-price]").evaluateAll((nodes) =>
    nodes.map((node) => Number(node.getAttribute("data-price"))),
  );
  return values;
}

test("lists products with categories loaded from the API", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(productCards(page)).toHaveCount(12);
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
  await expect(productCards(page)).toHaveCount(2);

  if (isMobile) await page.keyboard.press("Escape");
  await page.getByRole("link", { name: /iPhone 6/ }).first().click();
  await expect(page.getByRole("heading", { level: 1, name: "iPhone 6" })).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/category=smartphones&brand=Apple&maxPrice=500/);
  await expect(productCards(page)).toHaveCount(2);
});

test("sorting reorders products and is kept in the URL", async ({ page }) => {
  await page.goto("/?category=smartphones");

  await page.getByRole("combobox", { name: "Sort products" }).selectOption("price-asc");
  await expect(page).toHaveURL(/sort=price-asc/);

  const ascending = await prices(page);
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b));

  await page.reload();
  await expect(page.getByRole("combobox", { name: "Sort products" })).toHaveValue("price-asc");
});

test("active filter chips can be removed one by one", async ({ page }) => {
  await page.goto("/?category=smartphones&brand=Apple&maxPrice=500");
  const chips = page.getByRole("list", { name: "Active filters" });

  await chips.getByRole("button", { name: "Remove filter: Apple" }).click();
  await expect(page).toHaveURL(/\?category=smartphones&maxPrice=500$/);

  await chips.getByRole("button", { name: /Remove filter: Under/ }).click();
  await expect(page).toHaveURL(/\?category=smartphones$/);

  await chips.getByRole("button", { name: "Remove filter: Smartphones" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(chips).toHaveCount(0);
});

test("category pills switch category on mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "pills are only shown on small screens");
  await page.goto("/");

  const pills = page.getByRole("group", { name: "Categories" });
  await pills.getByRole("button", { name: "Fragrances" }).click();
  await expect(page).toHaveURL(/category=fragrances/);
  await expect(pills.getByRole("button", { name: "Fragrances" })).toHaveAttribute("aria-pressed", "true");
});

test("navbar search filters the list as you type", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search products" }).fill("iphone");

  await expect(page).toHaveURL(/q=iphone/);
  await expect(page.getByRole("link", { name: /iphone/i }).first()).toBeVisible();
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
