import { describe, expect, it } from "vitest";
import {
  formatApiDateTime,
  monthRange,
  normalizeDatePickerValue,
  splitApiDateTime
} from "./dateTimeService";

describe("Сервис даты и времени", () => {
  it("нормализует строковые значения date picker", () => {
    expect(normalizeDatePickerValue("2026-03-19")).toBe("2026-03-19");
  });

  it("нормализует Date в локальную строку даты", () => {
    expect(normalizeDatePickerValue(new Date(2026, 2, 19, 14, 5))).toBe("2026-03-19");
  });

  it("возвращает пустую строку для пустых значений", () => {
    expect(normalizeDatePickerValue("")).toBe("");
    expect(normalizeDatePickerValue(undefined)).toBe("");
  });

  it("собирает datetime для API из даты и времени", () => {
    expect(formatApiDateTime("2026-03-19", "14:05")).toBe("2026-03-19T14:05");
  });

  it("разбивает datetime API на дату и время", () => {
    expect(splitApiDateTime("2026-03-19T14:05:00")).toEqual({
      date: "2026-03-19",
      time: "14:05"
    });
  });

  it("возвращает полный диапазон месяца для выбранной даты", () => {
    expect(monthRange("2024-02-15")).toEqual({
      start: "2024-02-01",
      end: "2024-02-29"
    });
  });
});
