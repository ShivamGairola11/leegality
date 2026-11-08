# Product Catalog

An Amazon-style product listing and detail app built on the [DummyJSON Products API](https://dummyjson.com/docs/products).

**Live demo:** _coming soon_

## Features

- Product grid with image, title, price and rating, paginated 12 per page
- Filters for category (loaded from the API), price range and brand (taken from the loaded products), all combinable
- Navbar search that filters as you type
- Product detail page with an image gallery, description, brand, category and reviews
- Filters live in the URL, so Back, refresh and shared links all keep them
- Loading skeletons, error state with retry, empty state and 404 pages
- Mobile-first layout. On small screens the filters open in a drawer

## Tech stack

- **Next.js 16** (App Router, Cache Components) with **React 19** and **TypeScript**
- **Tailwind CSS v4** for styling, with no UI library
- **Playwright** for unit and end-to-end tests

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the dev server                        |
| `npm run build`     | Production build                            |
| `npm start`         | Serve the production build                  |
| `npm run lint`      | ESLint                                      |
| `npm run typecheck` | TypeScript check                            |
| `npm test`          | All tests (unit + e2e on desktop and mobile) |
| `npm run test:unit` | Unit tests only, no browser needed          |
| `npm run test:e2e`  | End-to-end tests only                       |

Before running e2e tests for the first time, install the browser with `npx playwright install chromium`. The tests start the dev server on their own.

## Project structure

```
src/
├── app/                      # Routes only: pages, loading, error and not-found files
│   ├── page.tsx              # Product listing
│   └── product/[id]/         # Product detail
├── components/
│   ├── ui/                   # Generic building blocks: Button, Input, Checkbox, Rating, Pagination, Drawer...
│   ├── layout/               # App shell: Navbar, sidebar state
│   └── icons.tsx
├── features/
│   └── products/             # Everything specific to products
│       ├── api/              # Data fetching (server only, cached)
│       ├── components/       # Listing, filters and detail components
│       ├── hooks/            # useProductFilters
│       ├── lib/              # Pure filter and URL helpers
│       ├── constants.ts
│       └── types.ts
└── lib/                      # App-wide helpers: API client, pagination, formatting
tests/
├── unit/                     # Pure logic (filters, pagination)
└── e2e/                      # User flows on desktop and mobile
```

`components/ui` knows nothing about products, and `features/products` holds all product logic. A new feature, such as a cart, would get its own folder under `features/` without touching existing code.

## Architectural decisions

**The URL is the single source of truth for filters.** Category, brands, price range, search and page are all query params, for example `/?category=smartphones&brand=Apple&maxPrice=500`. Filters therefore survive the trip to the detail page and back, a refresh, or a shared link, with no global store. `parseFilters` and `serializeFilters` are the only places that know the URL format.

**Category is server-side, everything else is client-side.**
- Picking a category fetches `/products/category/{slug}` on the server, through a normal router navigation.
- Brand, price, search and page filter the already-loaded list in the browser. They update the URL with `history.replaceState`, which Next.js keeps in sync with `useSearchParams`. These filters respond instantly and never hit the server.
- Brands are taken from the current category's products, as the spec asks, so changing category clears the selected brands.

**Data is fetched in Server Components and cached.** `getCategories`, `getProducts` and `getProduct` use `'use cache'` with `cacheLife`, so repeat visits and category switches don't call DummyJSON again. The listing asks for only the fields a card needs (`select=title,price,rating,...`) to keep payloads small. The API client retries a failed request once, because the public API sometimes drops one.

**Responsive feedback.**
- `useOptimistic` checks a checkbox immediately while the URL or server catches up.
- `useTransition` drives the loading skeleton while a new category loads.
- The filter panel is disabled during that load so a click can't be lost.

**Native platform features before custom code.**
- The mobile filter drawer is a `<dialog>`, which gives focus trapping, Escape to close and a backdrop for free.
- Checkboxes and number inputs are native elements.
- Partial star ratings are two layered rows of stars, with the filled row clipped to the rating's width.

**Error handling.**
- `error.tsx` catches API failures and offers a retry.
- An unknown product id returns a proper 404 through `notFound()`.
- An empty result shows a message with a way to clear filters.
- The price filter rejects a min price above the max price.

## Assumptions

- Category is single-select (matches the API, which has one category per product), and brand is multi-select.
- The full list for a category is loaded at once (`limit=0`; DummyJSON has about 194 products), so brand, price and search filtering are exact across all pages. Server-side `limit`/`skip` pagination would make brand and price filtering incomplete, because the API can't filter by them.
- The price range applies on **Apply** (or Enter), as in the mockup, rather than on every keystroke.
- The pagination under the detail image in the mockup is used to page through the product's images.
- Navbar search matches product title and brand. The search box inside the filter panel narrows the category and brand lists.
- Cart, orders and account icons are visual placeholders from the mockup.
- Products without a brand (some groceries) show "Unbranded" and are hidden when a brand filter is active.

## Improvements with more time

- Sort options (price, rating) and a "results per page" control
- Debounce the navbar search and add keyboard navigation for suggestions
- Visual regression snapshots in Playwright, plus CI that runs lint, typecheck and tests on every PR
- Show active filters as removable chips above the grid
- Add a cart with persisted state, since the icons already exist
- Image blur placeholders and prefetching the next page of images
- Error reporting (e.g. Sentry) wired into the error boundary
