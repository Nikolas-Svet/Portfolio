import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createAppointmentRepository } from "./appointment.js";
import { createDoctorRepository } from "./doctor.js";
import { createServiceRepository } from "./service.js";
import { createTestDb } from "../testUtils.js";

describe("appointment repository", () => {
  let database: Database.Database;
  let cleanup: () => void;

  beforeEach(() => {
    const testDb = createTestDb();
    database = testDb.database;
    cleanup = testDb.cleanup;
  });

  afterEach(() => {
    cleanup();
  });

  it("creates, lists latest first, limits, gets, updates and deletes appointments", () => {
    const doctorRepository = createDoctorRepository(database);
    const serviceRepository = createServiceRepository(database);
    const appointmentRepository = createAppointmentRepository(database);
    const doctor = doctorRepository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Доктор А"
    });
    const service = serviceRepository.createService({
      name: "Укол",
      price: 1500,
      doctor_id: doctor.id
    });
    const first = appointmentRepository.createAppointment({
      service_id: service.id,
      total_price: 1000,
      description: "Первый",
      date: "2026-03-10T09:00"
    });
    const second = appointmentRepository.createAppointment({
      service_id: service.id,
      total_price: 1100,
      description: "Второй",
      date: "2026-03-11T09:00"
    });
    const third = appointmentRepository.createAppointment({
      service_id: service.id,
      total_price: 1200,
      description: "Третий",
      date: "2026-03-12T09:00"
    });

    expect(appointmentRepository.listAppointments().map((appointment) => appointment.id)).toEqual([
      third.id,
      second.id,
      first.id
    ]);
    expect(appointmentRepository.listAppointments(2).map((appointment) => appointment.id)).toEqual([
      third.id,
      second.id
    ]);
    expect(appointmentRepository.getAppointmentById(first.id)).toMatchObject({
      id: first.id,
      total_price: 1000,
      description: "Первый",
      date: "2026-03-10T09:00"
    });

    expect(
      appointmentRepository.updateAppointment(second.id, {
        service_id: service.id,
        total_price: 2222,
        description: "Обновленный",
        date: "2026-03-21T13:45"
      })
    ).toBe(true);
    expect(appointmentRepository.getAppointmentById(second.id)).toMatchObject({
      total_price: 2222,
      description: "Обновленный",
      date: "2026-03-21T13:45"
    });
    expect(
      appointmentRepository.updateAppointment(9999, {
        service_id: service.id,
        total_price: 1,
        description: "Нет",
        date: "2026-03-01T00:00"
      })
    ).toBe(false);

    expect(appointmentRepository.deleteAppointment(first.id)).toBe(true);
    expect(appointmentRepository.getAppointmentById(first.id)).toBeNull();
    expect(appointmentRepository.deleteAppointment(9999)).toBe(false);
  });
});
