// Formats a numeric price for display in Russian rubles.
export function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(value);
}
