import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createDoctorRepository } from "./doctor.js";
import { createServiceRepository } from "./service.js";
import { createTestDb } from "../testUtils.js";

describe("service repository", () => {
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

  it("creates, lists, filters, gets, updates and deletes services", () => {
    const doctorRepository = createDoctorRepository(database);
    const serviceRepository = createServiceRepository(database);
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

    expect(serviceRepository.listServices().map((service) => service.id)).toEqual([
      serviceB.id,
      serviceA.id
    ]);
    expect(serviceRepository.listServices(doctorA.id).map((service) => service.id)).toEqual([
      serviceA.id
    ]);
    expect(serviceRepository.getServiceById(serviceA.id)).toMatchObject({
      id: serviceA.id,
      name: "Первичный прием",
      price: 3000,
      doctor_id: doctorA.id
    });

    expect(
      serviceRepository.updateService(serviceA.id, {
        name: "Контрольный прием",
        price: 3500,
        doctor_id: doctorB.id
      })
    ).toBe(true);
    expect(serviceRepository.getServiceById(serviceA.id)).toMatchObject({
      name: "Контрольный прием",
      price: 3500,
      doctor_id: doctorB.id
    });
    expect(
      serviceRepository.updateService(9999, {
        name: "Нет",
        price: 1,
        doctor_id: doctorA.id
      })
    ).toBe(false);

    expect(serviceRepository.deleteService(serviceB.id)).toBe(true);
    expect(serviceRepository.getServiceById(serviceB.id)).toBeNull();
    expect(serviceRepository.deleteService(9999)).toBe(false);
  });
});
