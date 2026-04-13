import { describe, expect, it } from "vitest";
import { formatPrice } from "./priceService";

describe("Сервис цены", () => {
  it("форматирует положительную цену в рублях", () => {
    expect(formatPrice(1500)).toMatch(/1\s*500,00\s*₽/);
  });

  it("форматирует нулевую цену в рублях", () => {
    expect(formatPrice(0)).toMatch(/0,00\s*₽/);
  });
});
