import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createAppointmentRepository, type AppointmentRepository } from "../repositories/appointment.js";
import { createDoctorRepository, type DoctorRepository } from "../repositories/doctor.js";
import { createServiceRepository, type ServiceRepository } from "../repositories/service.js";
import { createTestDb, getRouterHandler, invokeHandler } from "../testUtils.js";
import { createAppointmentsRouter } from "./appointments.js";

describe("appointments routes", () => {
  let database: Database.Database;
  let appointmentRepository: AppointmentRepository;
  let doctorRepository: DoctorRepository;
  let serviceRepository: ServiceRepository;
  let cleanup: () => void;
  let router: ReturnType<typeof createAppointmentsRouter>;

  beforeEach(() => {
    const testDb = createTestDb();
    database = testDb.database;
    appointmentRepository = createAppointmentRepository(database);
    doctorRepository = createDoctorRepository(database);
    serviceRepository = createServiceRepository(database);
    cleanup = testDb.cleanup;
    router = createAppointmentsRouter();
  });

  afterEach(() => {
    cleanup();
  });

  it("GET /api/appointments returns latest appointments and supports limit", async () => {
    const handler = getRouterHandler(router, "get", "/");
    const { serviceId } = createDoctorAndService();
    const first = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1000,
      description: "Первый",
      date: "2026-03-10T09:00"
    });
    const second = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1100,
      description: "Второй",
      date: "2026-03-11T09:00"
    });
    const third = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1200,
      description: "Третий",
      date: "2026-03-12T09:00"
    });

    const list = await invokeHandler(handler, { query: {} });
    const limited = await invokeHandler(handler, { query: { limit: "2" } });
    const invalid = await invokeHandler(handler, { query: { limit: "0" } });

    expect(list.response.statusCode).toBe(200);
    expect(
      (list.response.jsonBody as Array<{ id: number }>).map((appointment) => appointment.id)
    ).toEqual([third.id, second.id, first.id]);
    expect(limited.response.statusCode).toBe(200);
    expect(
      (limited.response.jsonBody as Array<{ id: number }>).map((appointment) => appointment.id)
    ).toEqual([third.id, second.id]);
    expect(invalid.response.statusCode).toBe(400);
    expect(invalid.response.jsonBody).toEqual({ error: "Invalid limit" });
  });

  it("GET /api/appointments/:id returns an appointment and handles invalid or missing ids", async () => {
    const handler = getRouterHandler(router, "get", "/:id");
    const { serviceId } = createDoctorAndService();
    const appointment = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1000,
      description: "Первый",
      date: "2026-03-10T09:00"
    });

    const success = await invokeHandler(handler, { params: { id: String(appointment.id) } });
    const invalid = await invokeHandler(handler, { params: { id: "abc" } });
    const missing = await invokeHandler(handler, { params: { id: "9999" } });

    expect(success.response.statusCode).toBe(200);
    expect(success.response.jsonBody).toEqual(
      expect.objectContaining({
        id: appointment.id,
        total_price: 1000,
        description: "Первый",
        date: "2026-03-10T09:00"
      })
    );
    expect(invalid.response.statusCode).toBe(400);
    expect(invalid.response.jsonBody).toEqual({ error: "Invalid id" });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Appointment not found" });
  });

  it("POST /api/appointments creates an appointment and validates payload and service references", async () => {
    const handler = getRouterHandler(router, "post", "/");
    const { serviceId } = createDoctorAndService();

    const created = await invokeHandler(handler, {
      body: {
        service_id: serviceId,
        total_price: 0,
        description: "",
        date: "2026-03-15T09:30"
      }
    });
    const invalidPayload = await invokeHandler(handler, {
      body: {
        service_id: serviceId,
        total_price: -1,
        description: "",
        date: "15.03.2026 09:30"
      }
    });
    const missingService = await invokeHandler(handler, {
      body: {
        service_id: 9999,
        total_price: 1000,
        description: "",
        date: "2026-03-15T09:30"
      }
    });

    expect(created.response.statusCode).toBe(201);
    expect(
      appointmentRepository.getAppointmentById((created.response.jsonBody as { id: number }).id)
    ).toMatchObject({
      service_id: serviceId,
      total_price: 0,
      description: "",
      date: "2026-03-15T09:30"
    });
    expect(invalidPayload.response.statusCode).toBe(422);
    expect(invalidPayload.response.jsonBody).toMatchObject({
      error: "Invalid payload",
      details: {
        fieldErrors: {
          total_price: expect.any(Array),
          date: expect.any(Array)
        }
      }
    });
    expect(missingService.response.statusCode).toBe(400);
    expect(missingService.response.jsonBody).toEqual({ error: "Service not found" });
  });

  it("PUT /api/appointments/:id updates appointment fields and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "put", "/:id");
    const { serviceId } = createDoctorAndService();
    const appointment = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1000,
      description: "До",
      date: "2026-03-10T09:00"
    });

    const updated = await invokeHandler(handler, {
      params: { id: String(appointment.id) },
      body: {
        service_id: serviceId,
        total_price: 2500,
        description: "После",
        date: "2026-03-21T13:45"
      }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" },
      body: {
        service_id: serviceId,
        total_price: 2500,
        description: "После",
        date: "2026-03-21T13:45"
      }
    });

    expect(updated.response.statusCode).toBe(200);
    expect(updated.response.jsonBody).toEqual({ ok: true });
    expect(appointmentRepository.getAppointmentById(appointment.id)).toMatchObject({
      total_price: 2500,
      description: "После",
      date: "2026-03-21T13:45"
    });
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Appointment not found" });
  });

  it("DELETE /api/appointments/:id deletes an appointment and returns not found when needed", async () => {
    const handler = getRouterHandler(router, "delete", "/:id");
    const { serviceId } = createDoctorAndService();
    const appointment = appointmentRepository.createAppointment({
      service_id: serviceId,
      total_price: 1000,
      description: "Первый",
      date: "2026-03-10T09:00"
    });

    const deleted = await invokeHandler(handler, {
      params: { id: String(appointment.id) }
    });
    const missing = await invokeHandler(handler, {
      params: { id: "9999" }
    });

    expect(deleted.response.statusCode).toBe(200);
    expect(deleted.response.jsonBody).toEqual({ ok: true });
    expect(appointmentRepository.getAppointmentById(appointment.id)).toBeNull();
    expect(missing.response.statusCode).toBe(404);
    expect(missing.response.jsonBody).toEqual({ error: "Appointment not found" });
  });

  function createDoctorAndService() {
    const doctor = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const service = serviceRepository.createService({
      name: "Укол",
      price: 1500,
      doctor_id: doctor.id
    });

    return { doctorId: doctor.id, serviceId: service.id };
  }
});
