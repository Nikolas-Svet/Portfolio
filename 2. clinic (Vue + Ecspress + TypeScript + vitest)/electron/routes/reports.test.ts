import { describe, expect, it, vi } from "vitest";
import { createReportsRouter } from "./reports.js";

describe("reports route", () => {
  describe("monthly", () => {
    it.each([
      {
        name: "rejects invalid month format",
        query: { month: "2026-3" },
        expectedError: "Invalid month. Expected YYYY-MM"
      },
      {
        name: "rejects only start without end",
        query: { month: "2026-03", start: "2026-03-05" },
        expectedError: "Both start and end are required"
      },
      {
        name: "rejects invalid start format",
        query: { month: "2026-03", start: "2026/03/05", end: "2026-03-12" },
        expectedError: "Invalid start date. Expected YYYY-MM-DD"
      },
      {
        name: "rejects invalid end format",
        query: { month: "2026-03", start: "2026-03-05", end: "12-03-2026" },
        expectedError: "Invalid end date. Expected YYYY-MM-DD"
      }
    ])("$name", async ({ query, expectedError }) => {
      const generateMonthlyReport = vi.fn();
      const handler = getRouteHandler(createReportsRouter({ generateMonthlyReport }), "/monthly", "get");
      const response = createMockResponse();

      await handler({ query }, response, response.next);

      expect(response.statusCode).toBe(400);
      expect(response.jsonBody).toEqual({ error: expectedError });
      expect(generateMonthlyReport).not.toHaveBeenCalled();
    });

    it("returns xlsx bytes with the expected headers on a valid request", async () => {
      const generateMonthlyReport = vi
        .fn()
        .mockResolvedValueOnce(new Uint8Array([80, 75, 3, 4, 1, 2]));
      const handler = getRouteHandler(createReportsRouter({ generateMonthlyReport }), "/monthly", "get");
      const response = createMockResponse();

      await handler(
        {
          query: {
            month: "2026-03",
            start: "2026-03-05",
            end: "2026-03-12"
          }
        },
        response,
        response.next
      );

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toBe(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      expect(response.headers["content-disposition"]).toBe(
        'attachment; filename="OTCHET_2026-03.xlsx"'
      );
      expect(generateMonthlyReport).toHaveBeenCalledWith({
        monthKey: "2026-03",
        startDate: "2026-03-05",
        endDate: "2026-03-12"
      });
      expect(Array.from(response.body ?? [])).toEqual([80, 75, 3, 4, 1, 2]);
    });
  });

  describe("daily pdf", () => {
    it.each([
      {
        name: "rejects invalid date",
        body: {
          date: "22-03-2026",
          ooo_cash: 0,
          ooo_cashless: 0,
          ip_cash: 0,
          ip_cashless: 0
        }
      },
      {
        name: "rejects missing required amount",
        body: {
          date: "2026-03-22",
          ooo_cash: 0,
          ooo_cashless: 0,
          ip_cash: 0
        }
      },
      {
        name: "rejects negative amount",
        body: {
          date: "2026-03-22",
          ooo_cash: -1,
          ooo_cashless: 0,
          ip_cash: 0,
          ip_cashless: 0
        }
      }
    ])("$name", async ({ body }) => {
      const generateDailyReportPdf = vi.fn();
      const handler = getRouteHandler(
        createReportsRouter({ generateDailyReportPdf }),
        "/daily/pdf",
        "post"
      );
      const response = createMockResponse();

      await handler({ body }, response, response.next);

      expect(response.statusCode).toBe(422);
      expect(response.jsonBody).toMatchObject({ error: "Invalid payload" });
      expect(generateDailyReportPdf).not.toHaveBeenCalled();
    });

    it("returns pdf bytes with the expected headers on a valid request", async () => {
      const generateDailyReportPdf = vi
        .fn()
        .mockResolvedValueOnce(new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]));
      const handler = getRouteHandler(
        createReportsRouter({ generateDailyReportPdf }),
        "/daily/pdf",
        "post"
      );
      const response = createMockResponse();
      const body = {
        date: "2026-03-22",
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      };

      await handler({ body }, response, response.next);

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toBe("application/pdf");
      expect(response.headers["content-disposition"]).toBe(
        'attachment; filename="OTCHET_2026-03-22.pdf"'
      );
      expect(generateDailyReportPdf).toHaveBeenCalledWith(body);
      expect(Array.from(response.body ?? [])).toEqual([37, 80, 68, 70, 45, 49, 46, 55]);
    });
  });
});

function getRouteHandler(
  router: ReturnType<typeof createReportsRouter>,
  path: string,
  method: "get" | "post"
) {
  const stack = router.stack as Array<{
    route?: {
      path?: string;
      methods?: Record<string, boolean>;
      stack?: Array<{ handle: unknown }>;
    };
  }>;
  const layer = stack.find((entry) => entry.route?.path === path && entry.route.methods?.[method]);

  if (!layer) {
    throw new Error(`Route was not registered: ${method.toUpperCase()} ${path}`);
  }

  return layer.route?.stack?.[0].handle as unknown as (
    req: { query?: Record<string, unknown>; body?: Record<string, unknown> },
    res: ReturnType<typeof createMockResponse>,
    next: (error?: unknown) => void
  ) => Promise<void>;
}

function createMockResponse() {
  const response = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    jsonBody: undefined as unknown,
    body: undefined as Buffer | undefined,
    errorFromNext: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.jsonBody = payload;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    },
    send(payload: Buffer) {
      this.body = payload;
      return this;
    },
    next(error?: unknown) {
      response.errorFromNext = error;
      if (error) {
        throw error;
      }
    }
  };

  return response;
}
