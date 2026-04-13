export type DatePickerValue = string | Date | null | undefined;
type TimePickerValue = string | Date | null | undefined;

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_PREFIX_RE = /^(\d{4}-\d{2}-\d{2})[T\s]/;
const TIME_ONLY_RE = /^(\d{2}:\d{2})/;
const TIME_PREFIX_RE = /[T\s](\d{2}:\d{2})/;

function isValidDate(value: Date) {
  return !Number.isNaN(value.getTime());
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatLocalDate(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

function formatLocalTime(value: Date) {
  return `${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

function normalizeTimeValue(value: TimePickerValue) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const timeOnly = trimmed.match(TIME_ONLY_RE);
    if (timeOnly) return timeOnly[1];

    const prefixedTime = trimmed.match(TIME_PREFIX_RE);
    if (prefixedTime) return prefixedTime[1];

    const parsed = new Date(trimmed);
    return isValidDate(parsed) ? formatLocalTime(parsed) : "";
  }

  if (value instanceof Date) {
    return isValidDate(value) ? formatLocalTime(value) : "";
  }

  return "";
}

function toLocalDate(value: DatePickerValue) {
  const normalized = normalizeDatePickerValue(value);
  if (!normalized) return null;

  const parsed = new Date(`${normalized}T00:00:00`);
  return isValidDate(parsed) ? parsed : null;
}

// Resolves a date picker value to a local YYYY-MM-DD string.
export function normalizeDatePickerValue(value: DatePickerValue) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (DATE_ONLY_RE.test(trimmed)) return trimmed;

    const prefixedDate = trimmed.match(DATE_PREFIX_RE);
    if (prefixedDate) return prefixedDate[1];

    const parsed = new Date(trimmed);
    return isValidDate(parsed) ? formatLocalDate(parsed) : "";
  }

  if (value instanceof Date) {
    return isValidDate(value) ? formatLocalDate(value) : "";
  }

  return "";
}

// Builds an API datetime string from separate date and time picker values.
export function formatApiDateTime(date: DatePickerValue, time: TimePickerValue) {
  const normalizedDate = normalizeDatePickerValue(date);
  const normalizedTime = normalizeTimeValue(time) || "00:00";

  if (!normalizedDate) return "";

  return `${normalizedDate}T${normalizedTime}`;
}

// Splits an API datetime into date and time fields suitable for UI controls.
export function splitApiDateTime(value: string) {
  return {
    date: normalizeDatePickerValue(value) || value,
    time: normalizeTimeValue(value) || "00:00"
  };
}

// Returns the first and last day of the month for a date picker value.
export function monthRange(value: DatePickerValue) {
  const date = toLocalDate(value);
  if (!date) {
    return { start: "", end: "" };
  }

  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return {
    start: formatLocalDate(start),
    end: formatLocalDate(end)
  };
}
