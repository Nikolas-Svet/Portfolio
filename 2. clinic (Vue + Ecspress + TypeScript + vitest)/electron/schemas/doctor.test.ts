import { describe, expect, it } from "vitest";
import { createDoctorSchema } from "./doctor.js";

describe("doctor schema", () => {
  it("requires both doctor_type and full_name", () => {
    const parsed = createDoctorSchema.safeParse({});

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      doctor_type: expect.any(Array),
      full_name: expect.any(Array)
    });
  });

  it("rejects blank and whitespace-only strings", () => {
    const parsed = createDoctorSchema.safeParse({
      doctor_type: "   ",
      full_name: ""
    });

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      doctor_type: expect.any(Array),
      full_name: expect.any(Array)
    });
  });

  it("trims accepted values", () => {
    expect(
      createDoctorSchema.parse({
        doctor_type: "  Терапевт  ",
        full_name: "  Иванова Мария Петровна  "
      })
    ).toEqual({
      doctor_type: "Терапевт",
      full_name: "Иванова Мария Петровна"
    });
  });
});
