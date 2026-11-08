import { expect, test } from "@playwright/test";

test("shows the full product details", async ({ page }) => {
  await page.goto("/product/1");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Essence Mascara Lash Princess");
  await expect(page.getByText("Brand:")).toBeVisible();
  await expect(page.getByText("Category:")).toBeVisible();
  await expect(page.getByText("Delivery", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Description" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
  await expect(page.getByRole("list", { name: "Rating breakdown" })).toBeVisible();
});

test("thumbnails and pagination switch the main image", async ({ page }) => {
  await page.goto("/product/121");

  await page.getByRole("button", { name: "Show image 3" }).click();
  await expect(page.getByRole("img", { name: /image 3 of/ })).toBeVisible();

  const gallery = page.getByRole("navigation", { name: "Product images" });
  await gallery.getByRole("button", { name: "Page 2" }).click();
  await expect(gallery.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("img", { name: /image 2 of/ })).toBeVisible();
});

test("breadcrumb links to the filtered catalog", async ({ page }) => {
  await page.goto("/product/121");
  await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Smartphones" }).click();
  await expect(page).toHaveURL(/\?category=smartphones$/);
});

test("related products come from the same category", async ({ page }) => {
  await page.goto("/product/121");
  const related = page.getByRole("region", { name: "More from Smartphones" });

  await expect(related.getByRole("link", { name: /iPhone 6/ })).toBeVisible();
  await expect(related.getByRole("link", { name: /iPhone 5s/ })).toHaveCount(0);
});

test("back goes to the catalog when opened directly", async ({ page }) => {
  await page.goto("/product/1");
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("shows a not found state for unknown products", async ({ page }) => {
  await page.goto("/product/99999");
  await expect(page.getByRole("heading", { name: "Product not found" })).toBeVisible();
});
