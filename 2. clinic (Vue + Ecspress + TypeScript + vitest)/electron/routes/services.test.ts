import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createDoctorRepository, type DoctorRepository } from "../repositories/doctor.js";
import { createServiceRepository, type ServiceRepository } from "../repositories/service.js";
import { createTestDb, getRouterHandler, invokeHandler } from "../testUtils.js";
import { createServicesRouter } from "./services.js";

describe("services routes", () => {
  let database: Database.Database;
  let doctorRepository: DoctorRepository;
  let serviceRepository: ServiceRepository;
  let cleanup: () => void;
  let router: ReturnType<typeof createServicesRouter>;

  beforeEach(() => {
    const testDb = createTestDb();
    database = testDb.database;
    doctorRepository = createDoctorRepository(database);
    serviceRepository = createServiceRepository(database);
    cleanup = testDb.cleanup;
    router = createServicesRouter();
  });

  afterEach(() => {
    cleanup();
  });

  it("GET /api/services returns services and supports doctor_id filtering", async () => {
    const handler = getRouterHandler(router, "get", "/");
    const doctorA = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const doctorB = doctorRepository.createDoctor({
      doctor_type: "Терапевт",
      full_name: "Доктор Б"
    });
    const serviceA = serviceRepository.createService({
      name: "Первичный прием",
      price: 3000,
      doctor_id: doctorA.id
    });
    const serviceB = serviceRepository.createService({
      name: "Повторный прием",
      price: 2000,
      doctor_id: doctorB.id
    });

    const list = await invokeHandler(handler, { query: {} });
    const filtered = await invokeHandler(handler, { query: { doctor_id: String(doctorA.id) } });
    const invalid = await invokeHandler(handler, { query: { doctor_id: "0" } });

    expect(list.response.statusCode).toBe(200);
    expect((list.response.jsonBody as Array<{ id: number }>).map((service) => service.id)).toEqual([
      serviceB.id,
      serviceA.id
    ]);
    expect(filtered.response.statusCode).toBe(200);
    expect(
      (filtered.response.jsonBody as Array<{ id: number }>).map((service) => service.id)
    ).toEqual([serviceA.id]);
    expect(invalid.response.statusCode).toBe(400);
    expect(invalid.response.jsonBody).toEqual({ error: "Invalid doctor_id" });
  });

  it("GET /api/services/:id returns a service and handles invalid or missing ids", async () => {
    const handler = getRouterHandler(router, "get", "/:id");
    const doctor = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const service = serviceRepository.createService({
      name: "Первичный прием",
      price: 3000,
      doctor_id: doctor.id
    });

    const success = await invokeHandler(handler, { params: { id: String(service.id) } });
    const invalid = await invokeHandler(handler, { params: { id: "abc" } });
    const missing = await invokeHandler(handler, { params: { id: "9999" } });

    expect(success.response.statusCode).toBe(200);
    expect(success.response.jsonBody).toEqual(
      expect.objectContaining({ id: service.id, name: "Первичный прием" })
    );
    expect(invalid.response.statusCode).toBe(400);
    expect(invalid.response.jsonBody).toEqual({ error: "Invalid id" });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Service not found" });
  });

  it("POST /api/services creates a service and validates payload and doctor references", async () => {
    const handler = getRouterHandler(router, "post", "/");
    const doctor = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });

    const created = await invokeHandler(handler, {
      body: {
        name: "  Укол  ",
        price: 0,
        doctor_id: doctor.id
      }
    });
    const invalidPayload = await invokeHandler(handler, {
      body: {
        name: "   ",
        price: -1,
        doctor_id: 0
      }
    });
    const missingDoctor = await invokeHandler(handler, {
      body: {
        name: "Укол",
        price: 1000,
        doctor_id: 9999
      }
    });

    expect(created.response.statusCode).toBe(201);
    expect(serviceRepository.getServiceById((created.response.jsonBody as { id: number }).id)).toMatchObject(
      {
        name: "Укол",
        price: 0,
        doctor_id: doctor.id
      }
    );
    expect(invalidPayload.response.statusCode).toBe(422);
    expect(invalidPayload.response.jsonBody).toMatchObject({
      error: "Invalid payload",
      details: {
        fieldErrors: {
          name: expect.any(Array),
          price: expect.any(Array),
          doctor_id: expect.any(Array)
        }
      }
    });
    expect(missingDoctor.response.statusCode).toBe(400);
    expect(missingDoctor.response.jsonBody).toEqual({ error: "Doctor not found" });
  });

  it("PUT /api/services/:id updates a service and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "put", "/:id");
    const doctorA = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const doctorB = doctorRepository.createDoctor({
      doctor_type: "Терапевт",
      full_name: "Доктор Б"
    });
    const service = serviceRepository.createService({
      name: "Первичный прием",
      price: 3000,
      doctor_id: doctorA.id
    });

    const updated = await invokeHandler(handler, {
      params: { id: String(service.id) },
      body: {
        name: "Контрольный прием",
        price: 3500,
        doctor_id: doctorB.id
      }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" },
      body: {
        name: "Контрольный прием",
        price: 3500,
        doctor_id: doctorB.id
      }
    });

    expect(updated.response.statusCode).toBe(200);
    expect(updated.response.jsonBody).toEqual({ ok: true });
    expect(serviceRepository.getServiceById(service.id)).toMatchObject({
      name: "Контрольный прием",
      price: 3500,
      doctor_id: doctorB.id
    });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Service not found" });
  });

  it("DELETE /api/services/:id deletes a service and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "delete", "/:id");
    const doctor = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const service = serviceRepository.createService({
      name: "Первичный прием",
      price: 3000,
      doctor_id: doctor.id
    });

    const deleted = await invokeHandler(handler, {
      params: { id: String(service.id) }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" }
    });

    expect(deleted.response.statusCode).toBe(200);
    expect(deleted.response.jsonBody).toEqual({ ok: true });
    expect(serviceRepository.getServiceById(service.id)).toBeNull();
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Service not found" });
  });
});
