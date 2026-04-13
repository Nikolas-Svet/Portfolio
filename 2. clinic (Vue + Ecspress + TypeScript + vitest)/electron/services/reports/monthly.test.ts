import type ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";
import {
  buildMonthlyReportWorkbook,
  buildSummaryEntries,
  loadMonthlyReportData,
  resolveRange,
  type MonthlyReportDb,
  type ReportDoctor,
  type ReportRow
} from "./monthly.js";

describe("monthly report service", () => {
  describe("resolveRange", () => {
    it("returns full month boundaries from monthKey", () => {
      expect(resolveRange({ monthKey: "2024-02" })).toEqual({
        start: "2024-02-01T00:00",
        end: "2024-02-29T23:59:59"
      });
    });

    it("prefers explicit startDate/endDate over full month", () => {
      expect(
        resolveRange({
          monthKey: "2026-03",
          startDate: "2026-03-05",
          endDate: "2026-03-12"
        })
      ).toEqual({
        start: "2026-03-05T00:00",
        end: "2026-03-12T23:59:59"
      });
    });
  });

  describe("loadMonthlyReportData", () => {
    it("includes month boundaries in the selected range", () => {
      const db = createFakeReportDb(
        [{ id: 1, doctor_name: "Анна Иванова" }],
        [
          makeRow({
            id: 1,
            date: "2026-03-01T00:00",
            total_price: 1500,
            description: "start",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 2,
            date: "2026-03-31T23:59",
            total_price: 1500,
            description: "end",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 3,
            date: "2026-02-28T23:59",
            total_price: 1500,
            description: "before",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 4,
            date: "2026-04-01T00:00",
            total_price: 1500,
            description: "after",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          })
        ]
      );

      const { rows } = loadMonthlyReportData(db, { monthKey: "2026-03" });

      expect(rows.map((row: ReportRow) => row.id)).toEqual([1, 2]);
    });

    it("narrows selection to the explicit custom range inside the month", () => {
      const db = createFakeReportDb(
        [{ id: 1, doctor_name: "Анна Иванова" }],
        [
          makeRow({
            id: 1,
            date: "2026-03-04T10:00",
            total_price: 1500,
            description: "before",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 2,
            date: "2026-03-05T00:00",
            total_price: 1500,
            description: "inside-start",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 3,
            date: "2026-03-10T12:30",
            total_price: 1500,
            description: "inside-middle",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 4,
            date: "2026-03-12T23:59",
            total_price: 1500,
            description: "inside-end",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 5,
            date: "2026-03-13T00:00",
            total_price: 1500,
            description: "after",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          })
        ]
      );

      const { rows } = loadMonthlyReportData(db, {
        monthKey: "2026-03",
        startDate: "2026-03-05",
        endDate: "2026-03-12"
      });

      expect(rows.map((row: ReportRow) => row.id)).toEqual([2, 3, 4]);
    });

    it("returns rows ordered by doctor, date and id", () => {
      const db = createFakeReportDb(
        [{ id: 1, doctor_name: "Анна Иванова" }],
        [
          makeRow({
            id: 30,
            date: "2026-03-05T10:00",
            total_price: 1500,
            description: "late",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 10,
            date: "2026-03-05T10:00",
            total_price: 1500,
            description: "same-date-lower-id",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 20,
            date: "2026-03-04T09:00",
            total_price: 1500,
            description: "early",
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          })
        ]
      );

      const { rows } = loadMonthlyReportData(db, { monthKey: "2026-03" });

      expect(rows.map((row: ReportRow) => row.id)).toEqual([20, 10, 30]);
    });
  });

  describe("buildMonthlyReportWorkbook", () => {
    it("creates doctor sheets for all doctors and writes grouped doctor rows with totals", () => {
      const doctors: ReportDoctor[] = [
        { id: 2, doctor_name: "Борис Петров" },
        { id: 1, doctor_name: "Анна Иванова" }
      ];
      const rows: ReportRow[] = [
        makeRow({
          id: 1,
          date: "2026-03-05T09:00",
          total_price: 1500,
          description: "Первый",
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        }),
        makeRow({
          id: 2,
          date: "2026-03-05T10:00",
          total_price: 1100,
          description: "",
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        }),
        makeRow({
          id: 3,
          date: "2026-03-06T11:00",
          total_price: 900,
          description: "Третий",
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Перевязка"
        })
      ];

      const workbook = buildMonthlyReportWorkbook(doctors, rows);

      expect(workbook.worksheets.map((sheet: ExcelJS.Worksheet) => sheet.name)).toEqual([
        "Анна Иванова",
        "Борис Петров",
        "Сводный отчет"
      ]);

      expect(readSheetRows(workbook.getWorksheet("Анна Иванова")!)).toEqual([
        ["5 марта", 1500, "Первый"],
        ["", 1100, ""],
        ["6 марта", 900, "Третий"],
        ["ИТОГО", 3500, ""]
      ]);

      expect(readSheetRows(workbook.getWorksheet("Борис Петров")!)).toEqual([["ИТОГО", 0, ""]]);
    });

    it("writes summary blocks per doctor, aggregates by factual price and keeps separators", () => {
      const doctors: ReportDoctor[] = [
        { id: 1, doctor_name: "Анна Иванова" },
        { id: 2, doctor_name: "Борис Петров" }
      ];
      const rows: ReportRow[] = [
        makeRow({
          id: 1,
          date: "2026-03-05T09:00",
          total_price: 1500,
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        }),
        makeRow({
          id: 2,
          date: "2026-03-06T09:00",
          total_price: 1500,
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        }),
        makeRow({
          id: 3,
          date: "2026-03-06T10:00",
          total_price: 1100,
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        }),
        makeRow({
          id: 4,
          date: "2026-03-07T10:00",
          total_price: 500,
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Анализ"
        }),
        makeRow({
          id: 5,
          date: "2026-03-08T10:00",
          total_price: 1500,
          doctor_id: 2,
          doctor_name: "Борис Петров",
          service_name: "Укол"
        })
      ];

      const workbook = buildMonthlyReportWorkbook(doctors, rows);

      expect(readSheetRows(workbook.getWorksheet("Сводный отчет")!)).toEqual([
        ["Анна Иванова", "Услуга", "Кол-во"],
        ["", "Анализ 500", 1],
        ["", "Укол 1100", 1],
        ["", "Укол 1500", 2],
        ["", "", ""],
        ["Борис Петров", "Услуга", "Кол-во"],
        ["", "Укол 1500", 1],
        ["", "", ""]
      ]);
    });
  });

  describe("buildSummaryEntries", () => {
    it("keeps separate regression lines for the same service with different factual prices", () => {
      const rows: ReportRow[] = [
        ...Array.from({ length: 9 }, (_, index) =>
          makeRow({
            id: index + 1,
            date: `2026-03-${String(index + 1).padStart(2, "0")}T09:00`,
            total_price: 1500,
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          })
        ),
        makeRow({
          id: 20,
          date: "2026-03-20T09:00",
          total_price: 1100,
          doctor_id: 1,
          doctor_name: "Анна Иванова",
          service_name: "Укол"
        })
      ];

      expect(buildSummaryEntries(rows)).toEqual([
        { serviceName: "Укол", price: 1100, count: 1 },
        { serviceName: "Укол", price: 1500, count: 9 }
      ]);
    });
  });
});

function makeRow(input: {
  id: number;
  date: string;
  total_price: number;
  doctor_id: number;
  doctor_name: string;
  service_name: string;
  description?: string;
}) {
  return {
    id: input.id,
    date: input.date,
    total_price: input.total_price,
    description: input.description ?? "",
    service_id: 1,
    service_name: input.service_name,
    service_price: input.total_price,
    doctor_id: input.doctor_id,
    doctor_name: input.doctor_name,
    doctor_type: "Травматолог"
  } satisfies ReportRow;
}

function createFakeReportDb(doctors: ReportDoctor[], rows: ReportRow[]): MonthlyReportDb {
  return {
    prepare(sql: string) {
      if (sql.includes("FROM doctors")) {
        return {
          all: () =>
            [...doctors].sort((a, b) => a.doctor_name.localeCompare(b.doctor_name, "ru-RU"))
        };
      }

      if (sql.includes("FROM appointments")) {
        return {
          all: (...params: unknown[]) => {
            const [start, end] = params as [string, string];
            return [...rows]
              .filter((row) => row.date >= start && row.date <= end)
              .sort((a, b) => {
                const byDoctor = a.doctor_name.localeCompare(b.doctor_name, "ru-RU");
                if (byDoctor !== 0) return byDoctor;
                const byDate = a.date.localeCompare(b.date);
                if (byDate !== 0) return byDate;
                return a.id - b.id;
              });
          }
        };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    }
  };
}

function readSheetRows(sheet: ExcelJS.Worksheet) {
  return Array.from({ length: sheet.rowCount }, (_, index) => {
    const row = sheet.getRow(index + 1);
    return [normalizeCell(row.getCell(1).value), normalizeCell(row.getCell(2).value), normalizeCell(row.getCell(3).value)];
  });
}

function normalizeCell(value: ExcelJS.CellValue | null | undefined) {
  if (value == null) return "";
  if (typeof value === "object") {
    throw new Error(`Unexpected cell value: ${JSON.stringify(value)}`);
  }
  return value;
}
