import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiGetMock, apiPostMock } = vi.hoisted(() => ({
  apiGetMock: vi.fn(),
  apiPostMock: vi.fn()
}));

vi.mock("../../api/http/api", () => ({
  API_PREFIX: "/api",
  api: {
    get: apiGetMock,
    post: apiPostMock
  }
}));

import {
  buildDailyReportFilename,
  buildDailyReportPayload,
  buildMonthlyReportQuery,
  buildReportFilename,
  downloadDailyReportPdf,
  fetchDailyReportPdf
} from "./reportService";

describe("Сервис отчётов", () => {
  beforeEach(() => {
    apiGetMock.mockReset();
    apiPostMock.mockReset();
  });

  it("собирает запрос месячного отчёта без кастомного диапазона", () => {
    expect(buildMonthlyReportQuery("2026-03-19", false, "", "")).toEqual({
      month: "2026-03"
    });
  });

  it("собирает запрос месячного отчёта с явным кастомным диапазоном", () => {
    expect(
      buildMonthlyReportQuery("2026-03-19", true, "2026-03-05", "2026-03-12")
    ).toEqual({
      month: "2026-03",
      start: "2026-03-05",
      end: "2026-03-12"
    });
  });

  it("возвращает полный месяц, когда кастомный диапазон включён, но не заполнен", () => {
    expect(buildMonthlyReportQuery("2024-02-15", true, "", "")).toEqual({
      month: "2024-02",
      start: "2024-02-01",
      end: "2024-02-29"
    });
  });

  it("собирает имя файла месячного отчёта", () => {
    expect(buildReportFilename("2026-03")).toBe("OTCHET_2026-03.xlsx");
  });

  it("собирает body для дневного PDF-отчёта", () => {
    expect(
      buildDailyReportPayload({
        date: "2026-03-21",
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      })
    ).toEqual({
      date: "2026-03-21",
      ooo_cash: 100,
      ooo_cashless: 200,
      ip_cash: 300,
      ip_cashless: 400
    });
  });

  it("вызывает daily pdf endpoint с корректным body", async () => {
    const blob = new Blob(["pdf"]);
    apiPostMock.mockResolvedValue({
      blob: vi.fn().mockResolvedValue(blob)
    });

    const result = await fetchDailyReportPdf({
      date: "2026-03-21",
      ooo_cash: 100,
      ooo_cashless: 200,
      ip_cash: 300,
      ip_cashless: 400
    });

    expect(apiPostMock).toHaveBeenCalledWith(
      "/api/reports/daily/pdf",
      {
        date: "2026-03-21",
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      },
      {
        headers: {
          Accept: "application/pdf",
          "Content-Type": "application/json"
        }
      }
    );
    expect(result).toEqual({
      blob,
      filename: "DAILY_REPORT_2026-03-21.pdf"
    });
  });

  it("запускает download flow для дневного PDF-отчёта", async () => {
    const blob = new Blob(["pdf"]);
    const fetchDailyReportPdfMock = vi.fn().mockResolvedValue({
      blob,
      filename: "DAILY_REPORT_2026-03-21.pdf"
    });
    const downloadBlobFileMock = vi.fn();

    const result = await downloadDailyReportPdf(
      {
        date: "2026-03-21",
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      },
      {
        fetchDailyReportPdf: fetchDailyReportPdfMock,
        downloadBlobFile: downloadBlobFileMock
      }
    );

    expect(fetchDailyReportPdfMock).toHaveBeenCalledWith({
      date: "2026-03-21",
      ooo_cash: 100,
      ooo_cashless: 200,
      ip_cash: 300,
      ip_cashless: 400
    });
    expect(downloadBlobFileMock).toHaveBeenCalledWith(blob, "DAILY_REPORT_2026-03-21.pdf");
    expect(result).toEqual({
      payload: {
        date: "2026-03-21",
        ooo_cash: 100,
        ooo_cashless: 200,
        ip_cash: 300,
        ip_cashless: 400
      },
      filename: "DAILY_REPORT_2026-03-21.pdf"
    });
  });

  it("собирает имя файла дневного отчёта", () => {
    expect(buildDailyReportFilename("2026-03-21")).toBe("DAILY_REPORT_2026-03-21.pdf");
  });
});
