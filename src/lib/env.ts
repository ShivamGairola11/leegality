/*
 * Typed access to environment variables. NEXT_PUBLIC_ values are inlined at
 * build time, so they must be read with their full literal name. The API URL
 * is public because the cart is priced from the browser.
 */
const DEFAULT_API_BASE_URL = "https://dummyjson.com";

export const env = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, ""),
};
