# Product Catalog

[![CI](https://github.com/ShivamGairola11/leegality/actions/workflows/ci.yml/badge.svg)](https://github.com/ShivamGairola11/leegality/actions/workflows/ci.yml)

An Amazon-style product listing and detail app built on the [DummyJSON Products API](https://dummyjson.com/docs/products).

**Live demo:** _coming soon_

## Features

**Listing**
- Product grid showing image, title, price with discount, rating and low-stock labels. 12 products per page, and the grid uses the full screen width (2 to 6 columns)
- Filters for category (loaded from the API), price range and brand (taken from the loaded products), all combinable
- Sorting by price, rating, discount or name
- Removable chips for every active filter, plus a "Clear all" button
- Navbar search that filters as you type
- On mobile, filters open in a drawer and categories are also shown as scrollable pills

**Detail**
- Image gallery with thumbnails and the page-style pagination from the mockup
- Price with discount, stock status, brand and category
- Delivery, warranty and return information
- Reviews with a rating breakdown, reviewer initials and dates
- Breadcrumbs, and a "More from this category" row
- The product image morphs from the card into the detail page (React View Transitions)

**General**
- Filters live in the URL, so Back, refresh and shared links all keep them
- Loading skeletons, an error state with retry, empty states and 404 pages
- Mobile-first, keyboard-accessible, and animations turn off when the user prefers reduced motion

## Tech stack

- **Next.js 16** (App Router, Cache Components) with **React 19** and **TypeScript**
- **Tailwind CSS v4** for styling, with no UI library
- **Playwright** for unit and end-to-end tests
- **GitHub Actions** for CI (lint, typecheck, unit tests, build, e2e on desktop and mobile)

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script              | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start the dev server                         |
| `npm run build`     | Production build                             |
| `npm start`         | Serve the production build                   |
| `npm run lint`      | ESLint                                       |
| `npm run typecheck` | Generate route types and run TypeScript      |
| `npm test`          | All tests (unit + e2e on desktop and mobile) |
| `npm run test:unit` | Unit tests only, no browser needed           |
| `npm run test:e2e`  | End-to-end tests only                        |

Before running e2e tests for the first time, install the browser with `npx playwright install chromium`. The tests start the dev server on their own.

## Project structure

```
src/
├── app/                      # Routes only: pages, loading, error and not-found files
│   ├── page.tsx              # Product listing
│   └── product/[id]/         # Product detail
├── components/
│   ├── ui/                   # Generic building blocks: Button, Select, Badge, Rating, Pagination, Drawer, Breadcrumbs...
│   ├── layout/               # App shell: Navbar, sidebar state
│   └── icons.tsx
├── features/
│   └── products/             # Everything specific to products
│       ├── api/              # Data fetching (server only, cached)
│       ├── components/       # Listing, filters/ and detail/ components
│       ├── hooks/            # useProductFilters
│       ├── lib/              # Pure helpers: filters, sorting, pricing
│       ├── constants.ts
│       └── types.ts
└── lib/                      # App-wide helpers: API client, pagination, formatting
tests/
├── unit/                     # Pure logic (filters, sorting, pricing, pagination)
└── e2e/                      # User flows on desktop and mobile
```

`components/ui` knows nothing about products, and `features/products` holds all product logic. A new feature, such as a cart, would get its own folder under `features/` without touching existing code.

## Architectural decisions

**The URL is the single source of truth for filters.** Category, brands, price range, search, sort and page are all query params, for example `/?category=smartphones&brand=Apple&maxPrice=500&sort=price-asc`. Filters therefore survive the trip to the detail page and back, a refresh, or a shared link, with no global store. `parseFilters` and `serializeFilters` are the only places that know the URL format.

**Category is server-side, everything else is client-side.**
- Picking a category fetches `/products/category/{slug}` on the server, through a normal router navigation.
- Brand, price, search, sort and page work on the already-loaded list in the browser. They update the URL with `history.replaceState`, which Next.js keeps in sync with `useSearchParams`. These changes respond instantly and never hit the server.
- Brands are taken from the current category's products, as the spec asks, so changing category clears the selected brands.

**Data is fetched in Server Components and cached.**
- `getCategories`, `getProducts` and `getProduct` use `'use cache'` with `cacheLife`, so repeat visits, category switches and the related-products row don't call DummyJSON again.
- The listing asks for only the fields a card needs, using `select=`.
- The first 24 product pages are prerendered at build time with `generateStaticParams`. The rest render on first visit and are cached after that. Prerendering all 194 overloaded the public API during builds.
- The API client retries network errors, 429s and 5xx responses with a short backoff.

**Responsive feedback.**
- `useOptimistic` checks a checkbox immediately while the URL or server catches up.
- `useTransition` drives the loading skeleton while a new category loads.
- The filter controls are disabled during that load so a click can't be lost.

**View transitions with React's `<ViewTransition>`.** The card image and the detail hero share a transition name, so the image morphs between pages without any animation library. Browsers without support just navigate normally, and the morph is turned off for users who prefer reduced motion.

**Native platform features before custom code.**
- The mobile filter drawer is a `<dialog>`, which gives focus trapping, Escape to close and a backdrop for free.
- Sort is a native `<select>`, and checkboxes and number inputs are native elements too.
- Partial star ratings are two layered rows of stars, with the filled row clipped to the rating's width.

**Error handling.**
- `error.tsx` catches API failures and offers a retry.
- An unknown product id shows a not-found page through `notFound()`.
- Empty results show a message with a way to clear filters.
- The price filter rejects a negative price or a min above the max.

## Assumptions

- Category is single-select (matches the API, which has one category per product), and brand is multi-select.
- The full list for a category is loaded at once (`limit=0`; DummyJSON has about 194 products), so brand, price, search and sort are exact across all pages. Server-side `limit`/`skip` pagination would make brand and price filtering incomplete, because the API can't filter by them.
- The price range applies on **Apply** (or Enter), as in the mockup, rather than on every keystroke.
- `price` is the selling price. The struck-through original price is worked back from `discountPercentage`, and discounts that round to 0% are hidden.
- Stock labels show "Only N left" at 5 or fewer and "Out of stock" at 0.
- The large rating in the review summary is the product's overall `rating`. The bars break down the individual reviews the API returns, usually 3.
- The pagination under the detail image in the mockup is used to page through the product's images, alongside thumbnails.
- Navbar search matches product title and brand. The search box inside the filter panel narrows the category and brand lists.
- Cart, orders and account icons are visual placeholders from the mockup.
- Products without a brand (some groceries) show "Unbranded" and are hidden when a brand filter is active.

## Improvements with more time

- A working cart with persisted state, since the icons already exist
- Debounce the navbar search and add keyboard-navigable suggestions
- Visual regression snapshots in Playwright
- Image blur placeholders, and prefetching the next page of images
- Directional page slides (forward and back) on top of the image morph
- Product JSON-LD and Open Graph images for SEO and share previews
- Error reporting (e.g. Sentry) wired into the error boundary
