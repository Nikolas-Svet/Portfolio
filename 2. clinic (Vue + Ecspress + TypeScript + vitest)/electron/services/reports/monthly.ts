import ExcelJS from "exceljs";
import { getDb } from "../../db.js";

export type MonthlyReportParams = {
  monthKey: string;
  startDate?: string;
  endDate?: string;
};

export type ReportDoctor = {
  id: number;
  doctor_name: string;
};

export type ReportRow = {
  id: number;
  date: string;
  total_price: number;
  description: string;
  service_id: number;
  service_name: string;
  service_price: number;
  doctor_id: number;
  doctor_name: string;
  doctor_type: string;
};

export type DoctorGroup = {
  doctor_id: number;
  doctor_name: string;
  rows: ReportRow[];
};

export type SummaryEntry = {
  serviceName: string;
  price: number;
  count: number;
};

export type MonthlyReportDb = {
  prepare(sql: string): {
    all(...params: unknown[]): unknown[];
  };
};

const dateLabel = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long"
});

export async function generateMonthlyReport(params: MonthlyReportParams) {
  return generateMonthlyReportWithDb(getDb(), params);
}

export async function generateMonthlyReportWithDb(db: MonthlyReportDb, params: MonthlyReportParams) {
  const { doctors, rows } = loadMonthlyReportData(db, params);
  const workbook = buildMonthlyReportWorkbook(doctors, rows);
  return workbook.xlsx.writeBuffer();
}

export function loadMonthlyReportData(db: MonthlyReportDb, params: MonthlyReportParams) {
  const doctors = db
    .prepare("SELECT id, full_name as doctor_name FROM doctors ORDER BY full_name")
    .all() as ReportDoctor[];
  const { start, end } = resolveRange(params);
  const rows = db
    .prepare(
      `
      SELECT
        a.id,
        a.date,
        a.total_price,
        a.description,
        a.service_id,
        s.name as service_name,
        s.price as service_price,
        s.doctor_id as doctor_id,
        d.full_name as doctor_name,
        d.doctor_type as doctor_type
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN doctors d ON s.doctor_id = d.id
      WHERE a.date >= ? AND a.date <= ?
      ORDER BY d.full_name, a.date, a.id
    `
    )
    .all(start, end) as ReportRow[];

  return { doctors, rows };
}

export function buildMonthlyReportWorkbook(doctors: ReportDoctor[], rows: ReportRow[]) {
  const groups = groupByDoctor(doctors, rows);
  const workbook = new ExcelJS.Workbook();

  for (const group of groups) {
    const sheet = workbook.addWorksheet(group.doctor_name);
    writeDoctorSheet(sheet, group);
  }

  const summary = workbook.addWorksheet("Сводный отчет");
  writeSummarySheet(summary, groups);

  return workbook;
}

export function groupByDoctor(doctors: ReportDoctor[], rows: ReportRow[]) {
  const map = new Map<number, DoctorGroup>();
  for (const doc of doctors) {
    map.set(doc.id, {
      doctor_id: doc.id,
      doctor_name: doc.doctor_name,
      rows: []
    });
  }
  for (const row of rows) {
    let group = map.get(row.doctor_id);
    if (!group) {
      group = {
        doctor_id: row.doctor_id,
        doctor_name: row.doctor_name,
        rows: []
      };
      map.set(row.doctor_id, group);
    }
    group.rows.push(row);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.doctor_name.localeCompare(b.doctor_name, "ru-RU")
  );
}

function writeDoctorSheet(sheet: ExcelJS.Worksheet, group: DoctorGroup) {
  let lastDate = "";
  let total = 0;

  for (const row of group.rows) {
    const datePart = extractDate(row.date);
    const dateCell = datePart !== lastDate ? formatDate(datePart) : "";
    if (datePart !== lastDate) lastDate = datePart;

    sheet.addRow([dateCell, row.total_price, row.description || ""]);
    total += row.total_price;
  }

  if (group.rows.length > 0) {
    sheet.addRow(["ИТОГО", total, ""]);
  } else {
    sheet.addRow(["ИТОГО", 0, ""]);
  }
}

function writeSummarySheet(sheet: ExcelJS.Worksheet, groups: DoctorGroup[]) {
  for (const group of groups) {
    sheet.addRow([group.doctor_name, "Услуга", "Кол-во"]);
    const items = buildSummaryEntries(group.rows);
    for (const entry of items) {
      sheet.addRow(["", `${entry.serviceName} ${entry.price}`, entry.count]);
    }
    sheet.addRow(["", "", ""]);
  }
}

export function buildSummaryEntries(rows: ReportRow[]) {
  const counts = new Map<string, SummaryEntry>();

  for (const row of rows) {
    const key = `${row.service_name}|||${row.total_price}`;
    const entry = counts.get(key) ?? {
      serviceName: row.service_name,
      price: row.total_price,
      count: 0
    };
    entry.count += 1;
    counts.set(key, entry);
  }

  return Array.from(counts.values()).sort((a, b) => {
    const byName = a.serviceName.localeCompare(b.serviceName, "ru-RU");
    if (byName !== 0) return byName;
    return a.price - b.price;
  });
}

function extractDate(value: string) {
  if (value.includes("T")) return value.split("T")[0];
  if (value.includes(" ")) return value.split(" ")[0];
  return value.slice(0, 10);
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);
  return dateLabel.format(date);
}

export function resolveRange(params: MonthlyReportParams) {
  if (params.startDate && params.endDate) {
    return {
      start: `${params.startDate}T00:00`,
      end: `${params.endDate}T23:59:59`
    };
  }

  const [yearStr, monthStr] = params.monthKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    start: `${yearStr}-${monthStr}-01T00:00`,
    end: `${yearStr}-${monthStr}-${String(lastDay).padStart(2, "0")}T23:59:59`
  };
}
