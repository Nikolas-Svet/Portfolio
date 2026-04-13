import { describe, expect, it } from "vitest";
import { createServiceSchema } from "./service.js";

describe("service schema", () => {
  it("requires name, price and doctor_id", () => {
    const parsed = createServiceSchema.safeParse({});

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      name: expect.any(Array),
      price: expect.any(Array),
      doctor_id: expect.any(Array)
    });
  });

  it("rejects blank names and doctor_id = 0", () => {
    const parsed = createServiceSchema.safeParse({
      name: "   ",
      price: 1000,
      doctor_id: 0
    });

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      name: expect.any(Array),
      doctor_id: expect.any(Array)
    });
  });

  it("accepts zero price and trims the name", () => {
    expect(
      createServiceSchema.parse({
        name: "  Укол  ",
        price: 0,
        doctor_id: 3
      })
    ).toEqual({
      name: "Укол",
      price: 0,
      doctor_id: 3
    });
  });

  it("rejects negative price", () => {
    const parsed = createServiceSchema.safeParse({
      name: "Укол",
      price: -1,
      doctor_id: 2
    });

    expect(parsed.success).toBe(false);

    if (parsed.success) {
      return;
    }

    expect(parsed.error.flatten().fieldErrors).toMatchObject({
      price: expect.any(Array)
    });
  });
});
