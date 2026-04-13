import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createDoctorRepository, type DoctorRepository } from "../repositories/doctor.js";
import { createDoctorsRouter } from "./doctors.js";
import { createTestDb, getRouterHandler, invokeHandler } from "../testUtils.js";

describe("doctors routes", () => {
  let database: Database.Database;
  let repository: DoctorRepository;
  let cleanup: () => void;
  let router: ReturnType<typeof createDoctorsRouter>;

  beforeEach(() => {
    const testDb = createTestDb();
    database = testDb.database;
    repository = createDoctorRepository(database);
    cleanup = testDb.cleanup;
    router = createDoctorsRouter();
  });

  afterEach(() => {
    cleanup();
  });

  it("GET /api/doctors returns the doctor list", async () => {
    const handler = getRouterHandler(router, "get", "/");
    const first = repository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор Один"
    });
    const second = repository.createDoctor({
      doctor_type: "Терапевт",
      full_name: "Доктор Два"
    });

    const { response, nextError } = await invokeHandler(handler, {});

    expect(nextError).toBeUndefined();
    expect(response.statusCode).toBe(200);
    expect(response.jsonBody).toEqual([
      expect.objectContaining({ id: second.id, doctor_type: "Терапевт", full_name: "Доктор Два" }),
      expect.objectContaining({ id: first.id, doctor_type: "Хирург", full_name: "Доктор Один" })
    ]);
  });

  it("GET /api/doctors/:id returns a doctor and handles invalid or missing ids", async () => {
    const handler = getRouterHandler(router, "get", "/:id");
    const created = repository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор Один"
    });

    const success = await invokeHandler(handler, { params: { id: String(created.id) } });
    const invalid = await invokeHandler(handler, { params: { id: "abc" } });
    const missing = await invokeHandler(handler, { params: { id: "9999" } });

    expect(success.response.statusCode).toBe(200);
    expect(success.response.jsonBody).toEqual(
      expect.objectContaining({
        id: created.id,
        doctor_type: "Хирург",
        full_name: "Доктор Один"
      })
    );
    expect(invalid.response.statusCode).toBe(400);
    expect(invalid.response.jsonBody).toEqual({ error: "Invalid id" });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Doctor not found" });
  });

  it("POST /api/doctors creates a doctor and trims payload values", async () => {
    const handler = getRouterHandler(router, "post", "/");

    const { response } = await invokeHandler(handler, {
      body: {
        doctor_type: "  Ортопед  ",
        full_name: "  Иванов Иван Иванович  "
      }
    });

    expect(response.statusCode).toBe(201);
    expect(response.jsonBody).toEqual({ id: expect.any(Number) });
    expect(repository.getDoctorById((response.jsonBody as { id: number }).id)).toMatchObject({
      doctor_type: "Ортопед",
      full_name: "Иванов Иван Иванович"
    });
  });

  it("POST /api/doctors returns a validation error for invalid payload", async () => {
    const handler = getRouterHandler(router, "post", "/");

    const { response } = await invokeHandler(handler, {
      body: {
        doctor_type: "   ",
        full_name: ""
      }
    });

    expect(response.statusCode).toBe(422);
    expect(response.jsonBody).toMatchObject({
      error: "Invalid payload",
      details: {
        fieldErrors: {
          doctor_type: expect.any(Array),
          full_name: expect.any(Array)
        }
      }
    });
  });

  it("PUT /api/doctors/:id updates a doctor and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "put", "/:id");
    const created = repository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор Один"
    });

    const updated = await invokeHandler(handler, {
      params: { id: String(created.id) },
      body: {
        doctor_type: "ЛОР",
        full_name: "Доктор Новый"
      }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" },
      body: {
        doctor_type: "ЛОР",
        full_name: "Доктор Новый"
      }
    });

    expect(updated.response.statusCode).toBe(200);
    expect(updated.response.jsonBody).toEqual({ ok: true });
    expect(repository.getDoctorById(created.id)).toMatchObject({
      doctor_type: "ЛОР",
      full_name: "Доктор Новый"
    });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Doctor not found" });
  });

  it("DELETE /api/doctors/:id deletes a doctor and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "delete", "/:id");
    const created = repository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор Один"
    });

    const deleted = await invokeHandler(handler, {
      params: { id: String(created.id) }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" }
    });

    expect(deleted.response.statusCode).toBe(200);
    expect(deleted.response.jsonBody).toEqual({ ok: true });
    expect(repository.getDoctorById(created.id)).toBeNull();
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Doctor not found" });
  });
});
