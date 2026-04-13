import { describe, expect, it, vi } from "vitest";
import {
  buildDailyReportModel,
  generateDailyReportPdfWithDeps,
  loadDailyReportData,
  type DailyReportDb,
  type DailyReportParams,
  type DailyReportRow
} from "./daily.js";
import { generateDailyReportPdfBuffer } from "./dailyPdf.js";

describe("daily report service", () => {
  it("loads only rows from the requested day and keeps doctor/date/id ordering", () => {
    const db = createFakeDailyDb([
      makeRow({
        id: 10,
        date: "2026-03-22T09:00",
        total_price: 1500,
        description: "inside-late-id",
        service_id: 2,
        doctor_id: 2,
        doctor_name: "Борис Петров",
        service_name: "Укол"
      }),
      makeRow({
        id: 5,
        date: "2026-03-22T09:00",
        total_price: 1200,
        description: "inside-first",
        service_id: 1,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Осмотр"
      }),
      makeRow({
        id: 6,
        date: "2026-03-22T09:00",
        total_price: 1100,
        description: "inside-second",
        service_id: 3,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      }),
      makeRow({
        id: 20,
        date: "2026-03-21T23:59",
        total_price: 900,
        description: "before",
        service_id: 3,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      }),
      makeRow({
        id: 21,
        date: "2026-03-23T00:00",
        total_price: 900,
        description: "after",
        service_id: 3,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      })
    ]);

    const rows = loadDailyReportData(db, "2026-03-22");

    expect(rows.map((row) => ({ id: row.id, service_id: row.service_id }))).toEqual([
      { id: 5, service_id: 1 },
      { id: 6, service_id: 3 },
      { id: 10, service_id: 2 }
    ]);
  });

  it("builds aggregated doctor rows by service_id and factual price", () => {
    const params: DailyReportParams = {
      date: "2026-03-22",
      ooo_cash: 100,
      ooo_cashless: 200,
      ip_cash: 300,
      ip_cashless: 400
    };
    const rows: DailyReportRow[] = [
      makeRow({
        id: 1,
        date: "2026-03-22T09:05",
        total_price: 1500,
        description: "первый укол",
        service_id: 10,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      }),
      makeRow({
        id: 2,
        date: "2026-03-22T10:05",
        total_price: 1500,
        description: "второй укол",
        service_id: 10,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      }),
      makeRow({
        id: 3,
        date: "2026-03-22T11:05",
        total_price: 1100,
        description: "скидочный укол",
        service_id: 10,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Укол"
      }),
      makeRow({
        id: 4,
        date: "2026-03-22T12:00",
        total_price: 500,
        description: "",
        service_id: 11,
        doctor_id: 1,
        doctor_name: "Анна Иванова",
        service_name: "Анализ"
      }),
      makeRow({
        id: 5,
        date: "2026-03-22T13:00",
        total_price: 900,
        description: "",
        service_id: 20,
        doctor_id: 2,
        doctor_name: "Борис Петров",
        service_name: "Перевязка"
      })
    ];

    const model = buildDailyReportModel(params, rows);

    expect(model.date).toBe("2026-03-22");
    expect(model.dateLabel).toBe("22 марта 2026 г.");
    expect(model.doctors).toEqual([
      {
        doctorId: 1,
        doctorName: "Анна Иванова",
        rows: [
          {
            serviceId: 11,
            quantity: 1,
            serviceName: "Анализ",
            totalPrice: 500
          },
          {
            serviceId: 10,
            quantity: 1,
            serviceName: "Укол",
            totalPrice: 1100
          },
          {
            serviceId: 10,
            quantity: 2,
            serviceName: "Укол",
            totalPrice: 1500
          }
        ]
      },
      {
        doctorId: 2,
        doctorName: "Борис Петров",
        rows: [
          {
            serviceId: 20,
            quantity: 1,
            serviceName: "Перевязка",
            totalPrice: 900
          }
        ]
      }
    ]);
    expect(model.cashEntries).toEqual([
      { label: "Касса ООО: наличные", value: 100 },
      { label: "Касса ООО: безналичные", value: 200 },
      { label: "Касса ИП: наличные", value: 300 },
      { label: "Касса ИП: безналичные", value: 400 }
    ]);
  });

  it("passes aggregated rows into the injected pdf renderer", async () => {
    const generatePdf = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));

    const result = await generateDailyReportPdfWithDeps(
      {
        db: createFakeDailyDb([
          makeRow({
            id: 1,
            date: "2026-03-22T09:05",
            total_price: 1500,
            description: "",
            service_id: 10,
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          }),
          makeRow({
            id: 2,
            date: "2026-03-22T10:05",
            total_price: 1500,
            description: "",
            service_id: 10,
            doctor_id: 1,
            doctor_name: "Анна Иванова",
            service_name: "Укол"
          })
        ]),
        generatePdf
      },
      {
        date: "2026-03-22",
        ooo_cash: 10,
        ooo_cashless: 20,
        ip_cash: 30,
        ip_cashless: 40
      }
    );

    expect(generatePdf).toHaveBeenCalledTimes(1);
    expect(generatePdf.mock.calls[0]?.[0]).toMatchObject({
      date: "2026-03-22",
      doctors: [
        {
          doctorName: "Анна Иванова",
          rows: [{ serviceName: "Укол", totalPrice: 1500, quantity: 2 }]
        }
      ]
    });
    expect(generatePdf.mock.calls[0]?.[0].cashEntries).toEqual([
      { label: "Касса ООО: наличные", value: 10 },
      { label: "Касса ООО: безналичные", value: 20 },
      { label: "Касса ИП: наличные", value: 30 },
      { label: "Касса ИП: безналичные", value: 40 }
    ]);
    expect(Array.from(result)).toEqual([1, 2, 3]);
  });

  it("generates a pdfkit-based buffer after switching to aggregated rows", async () => {
    const buffer = Buffer.from(
      await generateDailyReportPdfBuffer({
        date: "2026-03-22",
        dateLabel: "22 марта 2026 г.",
        doctors: [
          {
            doctorId: 1,
            doctorName: "Анна Иванова",
            rows: [
              {
                serviceId: 11,
                quantity: 1,
                serviceName: "Анализ",
                totalPrice: 500
              },
              {
                serviceId: 10,
                quantity: 1,
                serviceName: "Укол",
                totalPrice: 1100
              },
              {
                serviceId: 10,
                quantity: 9,
                serviceName: "Укол",
                totalPrice: 1500
              }
            ]
          }
        ],
        cashEntries: [
          { label: "Касса ООО: наличные", value: 1000 },
          { label: "Касса ООО: безналичные", value: 2000 },
          { label: "Касса ИП: наличные", value: 300 },
          { label: "Касса ИП: безналичные", value: 400 }
        ]
      })
    );
    const pdfText = buffer.toString("latin1");

    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(pdfText).toContain("/FontFile2");
    expect(pdfText).toContain("/Type /Page");
    expect(buffer.length).toBeGreaterThan(10000);
  });
});

function makeRow(input: {
  id: number;
  date: string;
  total_price: number;
  description: string;
  service_id: number;
  doctor_id: number;
  doctor_name: string;
  service_name: string;
}): DailyReportRow {
  return {
    id: input.id,
    date: input.date,
    total_price: input.total_price,
    description: input.description,
    service_id: input.service_id,
    doctor_id: input.doctor_id,
    doctor_name: input.doctor_name,
    service_name: input.service_name
  };
}

function createFakeDailyDb(rows: DailyReportRow[]): DailyReportDb {
  return {
    prepare(sql: string) {
      if (!sql.includes("FROM appointments")) {
        throw new Error(`Unexpected SQL: ${sql}`);
      }

      return {
        all: (...params: unknown[]) => {
          const [start, endExclusive] = params as [string, string];
          return [...rows]
            .filter((row) => row.date >= start && row.date < endExclusive)
            .sort((left, right) => {
              const byDoctor = left.doctor_name.localeCompare(right.doctor_name, "ru-RU");
              if (byDoctor !== 0) return byDoctor;
              const byDate = left.date.localeCompare(right.date);
              if (byDate !== 0) return byDate;
              return left.id - right.id;
            });
        }
      };
    }
  };
}
