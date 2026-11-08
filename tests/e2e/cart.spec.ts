import { expect, test } from "@playwright/test";

test("add to cart, change quantity and review the cart", async ({ page }) => {
  await page.goto("/?category=smartphones");
  const cartLink = page.getByRole("link", { name: /^Cart,/ });
  await expect(cartLink).toHaveAccessibleName("Cart, 0 items");

  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await expect(page.getByText("Added to cart")).toBeVisible();
  await expect(cartLink).toHaveAccessibleName("Cart, 1 item");

  await page.getByRole("button", { name: "Increase quantity" }).first().click();
  await expect(cartLink).toHaveAccessibleName("Cart, 2 items");

  await cartLink.click();
  await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();

  const summary = page.getByRole("complementary", { name: "Order summary" });
  await expect(summary.getByText("Items (2)")).toBeVisible();
  await expect(summary.getByText("Order total")).toBeVisible();
  await expect(summary.getByRole("button", { name: "Proceed to checkout" })).toBeEnabled();

  await page.getByRole("button", { name: "Decrease quantity" }).click();
  await expect(cartLink).toHaveAccessibleName("Cart, 1 item");
  await expect(summary.getByText("Items (1)")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Your cart is empty")).toBeVisible();
  await expect(cartLink).toHaveAccessibleName("Cart, 0 items");
});

test("the cart is kept after a reload", async ({ page }) => {
  await page.goto("/product/1");
  await page.getByRole("button", { name: "Add to cart" }).first().click();
  await page.reload();
  await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
  await expect(page.getByRole("group", { name: /Quantity for/ })).toBeVisible();
});

test("buy now adds the product and opens the cart", async ({ page }) => {
  await page.goto("/product/1");
  await page.getByRole("button", { name: "Buy now" }).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByRole("link", { name: "Essence Mascara Lash Princess" }).first()).toBeVisible();
});

test("profile shows a demo message", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Account" }).click();
  await expect(page.getByText("This is a demo")).toBeVisible();
});
