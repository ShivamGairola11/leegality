type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

const wholePriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatPrice(value: number) {
  return (Number.isInteger(value) ? wholePriceFormatter : priceFormatter).format(value);
}

export function formatLabel(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
