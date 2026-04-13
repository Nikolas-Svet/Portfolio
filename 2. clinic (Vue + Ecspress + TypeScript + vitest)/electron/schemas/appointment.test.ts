import { describe, expect, it } from "vitest";
import { createAppointmentSchema, isValidAppointmentDate } from "./appointment.js";

describe("appointment schema", () => {
  it("requires service_id, total_price and date", () => {
    const parsed = createAppointmentSchema.safeParse({});

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      service_id: expect.any(Array),
      total_price: expect.any(Array),
      date: expect.any(Array)
    });
  });

  it("rejects service_id = 0", () => {
    const parsed = createAppointmentSchema.safeParse({
      service_id: 0,
      total_price: 1500,
      description: "",
      date: "2026-03-15T09:30"
    });

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      service_id: expect.any(Array)
    });
  });

  it("accepts empty description and zero total_price", () => {
    expect(
      createAppointmentSchema.parse({
        service_id: 5,
        total_price: 0,
        description: "   ",
        date: "2026-03-15T09:30"
      })
    ).toEqual({
      service_id: 5,
      total_price: 0,
      description: "",
      date: "2026-03-15T09:30"
    });
  });

  it("rejects negative total_price", () => {
    const parsed = createAppointmentSchema.safeParse({
      service_id: 5,
      total_price: -1,
      description: "",
      date: "2026-03-15T09:30"
    });

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      total_price: expect.any(Array)
    });
  });

  it("accepts only valid appointment date formats", () => {
    expect(isValidAppointmentDate("2026-03-15T09:30")).toBe(true);
    expect(isValidAppointmentDate("2026-03-15 09:30")).toBe(true);
    expect(isValidAppointmentDate("2026/03/15 09:30")).toBe(false);
    expect(isValidAppointmentDate("2026-02-31T09:30")).toBe(false);
  });
});
