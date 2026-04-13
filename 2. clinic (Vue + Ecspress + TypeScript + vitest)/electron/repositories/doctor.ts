import type Database from "better-sqlite3";
import { getDb } from "../db.js";

export type Doctor = {
  id: number;
  doctor_type: string;
  full_name: string;
  created_at: string;
};

export type DoctorRepository = ReturnType<typeof createDoctorRepository>;

export function createDoctorRepository(database: Database.Database) {
  return {
    listDoctors(): Doctor[] {
      return database.prepare("SELECT * FROM doctors ORDER BY id DESC").all() as Doctor[];
    },

    getDoctorById(id: number): Doctor | null {
      const row = database.prepare("SELECT * FROM doctors WHERE id = ?").get(id) as
        | Doctor
        | undefined;

      return row ?? null;
    },

    createDoctor(input: { doctor_type: string; full_name: string }) {
      const result = database
        .prepare("INSERT INTO doctors (doctor_type, full_name) VALUES (@doctor_type, @full_name)")
        .run({
          doctor_type: input.doctor_type,
          full_name: input.full_name
        });

      return { id: Number(result.lastInsertRowid) };
    },

    updateDoctor(id: number, input: { doctor_type: string; full_name: string }) {
      const result = database
        .prepare(
          "UPDATE doctors SET doctor_type = @doctor_type, full_name = @full_name WHERE id = @id"
        )
        .run({
          id,
          doctor_type: input.doctor_type,
          full_name: input.full_name
        });

      return result.changes > 0;
    },

    deleteDoctor(id: number) {
      const result = database.prepare("DELETE FROM doctors WHERE id = ?").run(id);
      return result.changes > 0;
    }
  };
}

function getRepository() {
  return createDoctorRepository(getDb());
}

export function listDoctors() {
  return getRepository().listDoctors();
}

export function getDoctorById(id: number) {
  return getRepository().getDoctorById(id);
}

export function createDoctor(input: { doctor_type: string; full_name: string }) {
  return getRepository().createDoctor(input);
}

export function updateDoctor(id: number, input: { doctor_type: string; full_name: string }) {
  return getRepository().updateDoctor(id, input);
}

export function deleteDoctor(id: number) {
  return getRepository().deleteDoctor(id);
}
