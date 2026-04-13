import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type Database from "better-sqlite3";
import { createDoctorRepository } from "./doctor.js";
import { createTestDb } from "../testUtils.js";

describe("doctor repository", () => {
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

  it("creates, lists, gets, updates and deletes doctors", () => {
    const repository = createDoctorRepository(database);

    const first = repository.createDoctor({
      doctor_type: "Хирург",
      full_name: "Иван Иванов"
    });
    const second = repository.createDoctor({
      doctor_type: "Терапевт",
      full_name: "Петр Петров"
    });

    expect(repository.listDoctors().map((doctor) => doctor.id)).toEqual([second.id, first.id]);
    expect(repository.getDoctorById(first.id)).toMatchObject({
      id: first.id,
      doctor_type: "Хирург",
      full_name: "Иван Иванов"
    });

    expect(
      repository.updateDoctor(first.id, {
        doctor_type: "Ортопед",
        full_name: "Иван Иванович"
      })
    ).toBe(true);
    expect(repository.getDoctorById(first.id)).toMatchObject({
      doctor_type: "Ортопед",
      full_name: "Иван Иванович"
    });
    expect(repository.updateDoctor(9999, { doctor_type: "ЛОР", full_name: "Нет" })).toBe(false);

    expect(repository.deleteDoctor(second.id)).toBe(true);
    expect(repository.getDoctorById(second.id)).toBeNull();
    expect(repository.deleteDoctor(9999)).toBe(false);
  });
});
