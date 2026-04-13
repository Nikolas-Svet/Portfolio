import { z } from "zod";

const APPOINTMENT_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?$/;

export function isValidAppointmentDate(value: string) {
  const normalized = value.trim();

  if (!APPOINTMENT_DATE_PATTERN.test(normalized)) {
    return false;
  }

  const [datePart, timePart] = normalized.replace(" ", "T").split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes, seconds = 0] = timePart.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

  return (
    Number.isFinite(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hours &&
    date.getUTCMinutes() === minutes &&
    date.getUTCSeconds() === seconds
  );
}

export const createAppointmentSchema = z.object({
  service_id: z.number().int().positive(),
  total_price: z.number().nonnegative(),
  description: z.string().trim().optional().default(""),
  date: z
    .string()
    .trim()
    .refine(isValidAppointmentDate, "Invalid date. Expected YYYY-MM-DDTHH:mm")
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateAppointmentSchema = createAppointmentSchema;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
