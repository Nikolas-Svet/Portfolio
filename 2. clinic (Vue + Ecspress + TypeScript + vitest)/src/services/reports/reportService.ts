import { api, API_PREFIX } from "../../api/http/api";
import { monthRange, normalizeDatePickerValue, type DatePickerValue } from "../shared/dateTimeService";
import { downloadBlobFile } from "../shared/fileService";

export type MonthlyReportQuery = {
  month: string;
  start?: string;
  end?: string;
};

export type DailyReportInput = {
  date: DatePickerValue;
  ooo_cash: number;
  ooo_cashless: number;
  ip_cash: number;
  ip_cashless: number;
};

export type DailyReportPayload = {
  date: string;
  ooo_cash: number;
  ooo_cashless: number;
  ip_cash: number;
  ip_cashless: number;
};

function buildMonthKey(value: DatePickerValue) {
  const normalizedDate = normalizeDatePickerValue(value);
  return normalizedDate ? normalizedDate.slice(0, 7) : "";
}

// Builds the query params for the monthly report endpoint.
export function buildMonthlyReportQuery(
  date: DatePickerValue,
  rangeEnabled: boolean,
  start: DatePickerValue,
  end: DatePickerValue
): MonthlyReportQuery {
  const query: MonthlyReportQuery = {
    month: buildMonthKey(date)
  };

  if (!rangeEnabled) {
    return query;
  }

  const fallbackRange = monthRange(date);
  const normalizedStart = normalizeDatePickerValue(start) || fallbackRange.start;
  const normalizedEnd = normalizeDatePickerValue(end) || fallbackRange.end;

  if (normalizedStart) query.start = normalizedStart;
  if (normalizedEnd) query.end = normalizedEnd;

  return query;
}

// Builds the downloaded Excel filename for a monthly report.
export function buildReportFilename(monthKey: string) {
  return monthKey ? `OTCHET_${monthKey}.xlsx` : "OTCHET.xlsx";
}

// Loads the monthly report file from the backend.
export async function fetchMonthlyReportBlob(query: MonthlyReportQuery) {
  const response = await api.get(`${API_PREFIX}/reports/monthly`, { query });
  return response.blob();
}

// Creates the initial form state for the daily PDF report.
export function createInitialDailyReportForm(date: DatePickerValue = new Date()): DailyReportInput {
  return {
    date,
    ooo_cash: 0,
    ooo_cashless: 0,
    ip_cash: 0,
    ip_cashless: 0
  };
}

// Checks whether the daily PDF report form can be submitted.
export function isDailyReportFormValid(form: DailyReportInput) {
  const normalizedDate = normalizeDatePickerValue(form.date);
  const amounts = [form.ooo_cash, form.ooo_cashless, form.ip_cash, form.ip_cashless];

  return (
    normalizedDate.length > 0 &&
    amounts.every((value) => Number.isFinite(value) && value >= 0)
  );
}

// Builds the API body for the daily PDF report endpoint.
export function buildDailyReportPayload(form: DailyReportInput): DailyReportPayload {
  return {
    date: normalizeDatePickerValue(form.date),
    ooo_cash: form.ooo_cash,
    ooo_cashless: form.ooo_cashless,
    ip_cash: form.ip_cash,
    ip_cashless: form.ip_cashless
  };
}

// Builds the downloaded PDF filename for a daily report.
export function buildDailyReportFilename(date: DatePickerValue) {
  const normalizedDate = normalizeDatePickerValue(date);
  return normalizedDate ? `DAILY_REPORT_${normalizedDate}.pdf` : "DAILY_REPORT.pdf";
}

// Loads the daily PDF report file from the backend.
export async function fetchDailyReportPdf(payload: DailyReportPayload) {
  const response = await api.post(`${API_PREFIX}/reports/daily/pdf`, payload, {
    headers: {
      Accept: "application/pdf",
      "Content-Type": "application/json"
    }
  });

  return {
    blob: await response.blob(),
    filename: buildDailyReportFilename(payload.date)
  };
}

// Downloads the daily PDF report file for the provided form values.
export async function downloadDailyReportPdf(
  form: DailyReportInput,
  deps: {
    fetchDailyReportPdf?: typeof fetchDailyReportPdf;
    downloadBlobFile?: typeof downloadBlobFile;
  } = {}
) {
  const fetcher = deps.fetchDailyReportPdf ?? fetchDailyReportPdf;
  const downloader = deps.downloadBlobFile ?? downloadBlobFile;
  const payload = buildDailyReportPayload(form);
  const { blob, filename } = await fetcher(payload);

  downloader(blob, filename);

  return {
    payload,
    filename
  };
}
