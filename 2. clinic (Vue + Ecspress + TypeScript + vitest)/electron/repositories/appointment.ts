import type Database from "better-sqlite3";
import { getDb } from "../db.js";

export type Appointment = {
  id: number;
  service_id: number;
  total_price: number;
  description: string;
  date: string;
  created_at: string;
};

export type AppointmentRepository = ReturnType<typeof createAppointmentRepository>;

export function createAppointmentRepository(database: Database.Database) {
  return {
    listAppointments(limit?: number): Appointment[] {
      if (limit && Number.isInteger(limit) && limit > 0) {
        return database
          .prepare("SELECT * FROM appointments ORDER BY id DESC LIMIT ?")
          .all(limit) as Appointment[];
      }

      return database
        .prepare("SELECT * FROM appointments ORDER BY id DESC")
        .all() as Appointment[];
    },

    getAppointmentById(id: number): Appointment | null {
      const row = database.prepare("SELECT * FROM appointments WHERE id = ?").get(id) as
        | Appointment
        | undefined;

      return row ?? null;
    },

    createAppointment(input: {
      service_id: number;
      total_price: number;
      description: string;
      date: string;
    }) {
      const result = database
        .prepare(
          `INSERT INTO appointments (service_id, total_price, description, date)
           VALUES (@service_id, @total_price, @description, @date)`
        )
        .run({
          service_id: input.service_id,
          total_price: input.total_price,
          description: input.description,
          date: input.date
        });

      return { id: Number(result.lastInsertRowid) };
    },

    updateAppointment(
      id: number,
      input: { service_id: number; total_price: number; description: string; date: string }
    ) {
      const result = database
        .prepare(
          "UPDATE appointments SET service_id = @service_id, total_price = @total_price, description = @description, date = @date WHERE id = @id"
        )
        .run({
          id,
          service_id: input.service_id,
          total_price: input.total_price,
          description: input.description,
          date: input.date
        });

      return result.changes > 0;
    },

    deleteAppointment(id: number) {
      const result = database.prepare("DELETE FROM appointments WHERE id = ?").run(id);
      return result.changes > 0;
    }
  };
}

function getRepository() {
  return createAppointmentRepository(getDb());
}

export function listAppointments(limit?: number) {
  return getRepository().listAppointments(limit);
}

export function getAppointmentById(id: number) {
  return getRepository().getAppointmentById(id);
}

export function createAppointment(input: {
  service_id: number;
  total_price: number;
  description: string;
  date: string;
}) {
  return getRepository().createAppointment(input);
}

export function updateAppointment(
  id: number,
  input: { service_id: number; total_price: number; description: string; date: string }
) {
  return getRepository().updateAppointment(id, input);
}

export function deleteAppointment(id: number) {
  return getRepository().deleteAppointment(id);
}
