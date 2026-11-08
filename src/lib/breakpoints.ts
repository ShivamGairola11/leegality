export const DESKTOP_QUERY = "(min-width: 1024px)";

export function isDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}
