/*
 * Remembers, for the current browser session, whether the catalog was shown.
 * The detail page's back button uses this to decide between history.back()
 * (filters restored from the URL) and a plain link home when opened directly.
 */
let catalogVisited = false;

export function markCatalogVisited() {
  catalogVisited = true;
}

export function hasVisitedCatalog() {
  return catalogVisited;
}
