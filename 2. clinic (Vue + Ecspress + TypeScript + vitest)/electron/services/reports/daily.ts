import { getDb } from "../../db.js";
import { generateDailyReportPdfBuffer } from "./dailyPdf.js";

export type DailyReportParams = {
  date: string;
  ooo_cash: number;
  ooo_cashless: number;
  ip_cash: number;
  ip_cashless: number;
};

export type DailyReportRow = {
  id: number;
  date: string;
  total_price: number;
  description: string;
  service_id: number;
  service_name: string;
  doctor_id: number;
  doctor_name: string;
};

export type DailyDoctorGroup = {
  doctor_id: number;
  doctor_name: string;
  rows: DailyReportRow[];
};

export type DailyCashEntry = {
  label: string;
  value: number;
};

export type DailyReportModel = {
  date: string;
  dateLabel: string;
  doctors: Array<{
    doctorId: number;
    doctorName: string;
    rows: Array<{
      serviceId: number;
      quantity: number;
      serviceName: string;
      totalPrice: number;
    }>;
  }>;
  cashEntries: DailyCashEntry[];
};

export type DailyReportDb = {
  prepare(sql: string): {
    all(...params: unknown[]): unknown[];
  };
};

type DailyPdfGenerator = (model: DailyReportModel) => Uint8Array | Promise<Uint8Array>;

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const dailyDateLabel = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});

export async function generateDailyReportPdf(params: DailyReportParams) {
  return generateDailyReportPdfWithDeps({ db: getDb(), generatePdf: generateDailyReportPdfBuffer }, params);
}

export async function generateDailyReportPdfWithDeps(
  deps: {
    db: DailyReportDb;
    generatePdf: DailyPdfGenerator;
  },
  params: DailyReportParams
) {
  const rows = loadDailyReportData(deps.db, params.date);
  const model = buildDailyReportModel(params, rows);
  return await deps.generatePdf(model);
}

export function loadDailyReportData(db: DailyReportDb, date: string) {
  const { start, endExclusive } = resolveDailyRange(date);

  return db
    .prepare(
      `
      SELECT
        a.id,
        a.date,
        a.total_price,
        a.description,
        s.id as service_id,
        s.name as service_name,
        d.id as doctor_id,
        d.full_name as doctor_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN doctors d ON s.doctor_id = d.id
      WHERE a.date >= ? AND a.date < ?
      ORDER BY d.full_name, a.date, a.id
    `
    )
    .all(start, endExclusive) as DailyReportRow[];
}

export function groupDailyRowsByDoctor(rows: DailyReportRow[]) {
  const groups = new Map<number, DailyDoctorGroup>();

  for (const row of rows) {
    const existing = groups.get(row.doctor_id);

    if (existing) {
      existing.rows.push(row);
      continue;
    }

    groups.set(row.doctor_id, {
      doctor_id: row.doctor_id,
      doctor_name: row.doctor_name,
      rows: [row]
    });
  }

  return Array.from(groups.values()).sort((left, right) =>
    left.doctor_name.localeCompare(right.doctor_name, "ru-RU")
  );
}

export function buildDailyReportModel(params: DailyReportParams, rows: DailyReportRow[]): DailyReportModel {
  const doctorGroups = groupDailyRowsByDoctor(rows);

  return {
    date: params.date,
    dateLabel: formatDateLabel(params.date),
    doctors: doctorGroups.map((group) => ({
      doctorId: group.doctor_id,
      doctorName: group.doctor_name,
      rows: buildDailyDoctorRows(group.rows)
    })),
    cashEntries: [
      {
        label: "Касса ООО: наличные",
        value: params.ooo_cash
      },
      {
        label: "Касса ООО: безналичные",
        value: params.ooo_cashless
      },
      {
        label: "Касса ИП: наличные",
        value: params.ip_cash
      },
      {
        label: "Касса ИП: безналичные",
        value: params.ip_cashless
      }
    ]
  };
}

function buildDailyDoctorRows(rows: DailyReportRow[]) {
  const entries = new Map<string, DailyReportModel["doctors"][number]["rows"][number]>();

  for (const row of rows) {
    const key = `${row.service_id}:${row.total_price}`;
    const existing = entries.get(key);

    if (existing) {
      existing.quantity += 1;
      continue;
    }

    entries.set(key, {
      serviceId: row.service_id,
      quantity: 1,
      serviceName: row.service_name,
      totalPrice: row.total_price
    });
  }

  return Array.from(entries.values()).sort((left, right) => {
    const byService = left.serviceName.localeCompare(right.serviceName, "ru-RU");
    if (byService !== 0) {
      return byService;
    }

    const byPrice = left.totalPrice - right.totalPrice;
    if (byPrice !== 0) {
      return byPrice;
    }

    return left.serviceId - right.serviceId;
  });
}

export function isValidDateOnly(value: string) {
  if (!dateOnlyPattern.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function resolveDailyRange(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + 1));

  return {
    start: `${date}T00:00`,
    endExclusive: `${formatDateOnlyUtc(nextDate)}T00:00`
  };
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return dailyDateLabel.format(new Date(Date.UTC(year, month - 1, day)));
}

function formatDateOnlyUtc(value: Date) {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
