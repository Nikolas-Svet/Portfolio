import type Database from "better-sqlite3";
import { getDb } from "../db.js";

export type Service = {
  id: number;
  name: string;
  price: number;
  doctor_id: number;
  created_at: string;
};

export type ServiceRepository = ReturnType<typeof createServiceRepository>;

export function createServiceRepository(database: Database.Database) {
  return {
    listServices(doctorId?: number): Service[] {
      if (doctorId) {
        return database
          .prepare("SELECT * FROM services WHERE doctor_id = ? ORDER BY id DESC")
          .all(doctorId) as Service[];
      }

      return database.prepare("SELECT * FROM services ORDER BY id DESC").all() as Service[];
    },

    getServiceById(id: number): Service | null {
      const row = database.prepare("SELECT * FROM services WHERE id = ?").get(id) as
        | Service
        | undefined;

      return row ?? null;
    },

    createService(input: { name: string; price: number; doctor_id: number }) {
      const result = database
        .prepare("INSERT INTO services (name, price, doctor_id) VALUES (@name, @price, @doctor_id)")
        .run({
          name: input.name,
          price: input.price,
          doctor_id: input.doctor_id
        });

      return { id: Number(result.lastInsertRowid) };
    },

    updateService(id: number, input: { name: string; price: number; doctor_id: number }) {
      const result = database
        .prepare(
          "UPDATE services SET name = @name, price = @price, doctor_id = @doctor_id WHERE id = @id"
        )
        .run({
          id,
          name: input.name,
          price: input.price,
          doctor_id: input.doctor_id
        });

      return result.changes > 0;
    },

    deleteService(id: number) {
      const result = database.prepare("DELETE FROM services WHERE id = ?").run(id);
      return result.changes > 0;
    }
  };
}

function getRepository() {
  return createServiceRepository(getDb());
}

export function listServices(doctorId?: number) {
  return getRepository().listServices(doctorId);
}

export function getServiceById(id: number) {
  return getRepository().getServiceById(id);
}

export function createService(input: { name: string; price: number; doctor_id: number }) {
  return getRepository().createService(input);
}

export function updateService(id: number, input: { name: string; price: number; doctor_id: number }) {
  return getRepository().updateService(id, input);
}

export function deleteService(id: number) {
  return getRepository().deleteService(id);
}
